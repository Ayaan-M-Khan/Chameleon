import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

interface ServerPlayer {
  id: string;
  name: string;
  isHuman: boolean;
  isHost: boolean;
  avatar: string;
  score: number;
  role: 'innocent' | 'fox';
  clue: string;
  hasSubmittedClue: boolean;
  votedForId: string | null;
  isReady: boolean;
}

interface ServerGameSettings {
  pointForGuessingFox: boolean;
  foxSeeOneClueEarly: boolean;
  anonymousVoting: boolean;
  turnTimer: boolean;
  turnTimerSeconds: number;
  privateGame: boolean;
  roomPassword?: string;
  chameleonCount: number;
  targetScore: number;
  innocentCatchPoints: number;
  chameleonEscapePoints: number;
  chameleonStealPoints: number;
}

interface ServerRoom {
  id: string;
  password?: string;
  hostId: string;
  gameMode: 'solo' | 'pass_and_play' | 'room';
  gamePhase: 'home' | 'lobby' | 'clue_submission' | 'voting' | 'fox_guess' | 'round_resolution';
  roundNumber: number;
  players: ServerPlayer[];
  selectedCategoryId: string;
  category?: any;
  secretCoordinate?: any;
  foxPlayerId?: string;
  roundResolution?: any;
  settings: ServerGameSettings;
  createdAt: number;
  lastActive: number;
}

// In-memory room store
const rooms = new Map<string, ServerRoom>();

// WebSocket client registry: ws -> { roomId, playerId }
interface ClientMeta {
  roomId?: string;
  playerId?: string;
  isAlive: boolean;
}
const clients = new Map<WebSocket, ClientMeta>();

// Broadcast helper to all clients in a specific room
function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const [ws, meta] of clients.entries()) {
    if (meta.roomId === roomId && ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, timestamp: Date.now() });
});

// Create or initialize a room
app.post('/api/rooms/create', (req, res) => {
  const { roomId, hostPlayer, settings, gameMode, selectedCategoryId } = req.body;
  if (!roomId || !hostPlayer) {
    return res.status(400).json({ error: 'Missing roomId or hostPlayer' });
  }

  const defaultSettings: ServerGameSettings = {
    pointForGuessingFox: true,
    foxSeeOneClueEarly: false,
    anonymousVoting: false,
    turnTimer: true,
    turnTimerSeconds: 60,
    privateGame: false,
    chameleonCount: 1,
    targetScore: 5,
    innocentCatchPoints: 2,
    chameleonEscapePoints: 2,
    chameleonStealPoints: 1,
    ...settings,
  };

  const newRoom: ServerRoom = {
    id: roomId,
    password: settings?.roomPassword || '',
    hostId: hostPlayer.id,
    gameMode: gameMode || 'room',
    gamePhase: 'lobby',
    roundNumber: 1,
    // In room multiplayer, ONLY the host starts in the room! No unsolicited bots.
    players: [
      {
        ...hostPlayer,
        isHost: true,
        isHuman: true,
        score: hostPlayer.score || 0,
        clue: '',
        hasSubmittedClue: false,
        votedForId: null,
        isReady: false,
      },
    ],
    selectedCategoryId: selectedCategoryId || 'sports',
    settings: defaultSettings,
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  rooms.set(roomId, newRoom);
  res.json({ success: true, room: newRoom });
});

// Join an existing room
app.post('/api/rooms/:roomId/join', (req, res) => {
  const { roomId } = req.params;
  const { player, password } = req.body;

  let room = rooms.get(roomId);

  // If room doesn't exist yet on server (e.g. created by link or code), auto-create or restore
  if (!room) {
    const defaultSettings: ServerGameSettings = {
      pointForGuessingFox: true,
      foxSeeOneClueEarly: false,
      anonymousVoting: false,
      turnTimer: true,
      turnTimerSeconds: 60,
      privateGame: false,
      chameleonCount: 1,
      targetScore: 5,
      innocentCatchPoints: 2,
      chameleonEscapePoints: 2,
      chameleonStealPoints: 1,
      roomPassword: password || '',
    };

    room = {
      id: roomId,
      password: password || '',
      hostId: player?.id || 'host',
      gameMode: 'room',
      gamePhase: 'lobby',
      roundNumber: 1,
      players: player
        ? [
            {
              ...player,
              isHost: true,
              isHuman: true,
              score: 0,
              clue: '',
              hasSubmittedClue: false,
              votedForId: null,
              isReady: false,
            },
          ]
        : [],
      selectedCategoryId: 'sports',
      settings: defaultSettings,
      createdAt: Date.now(),
      lastActive: Date.now(),
    };
    rooms.set(roomId, room);
    return res.json({ success: true, room, joinedPlayer: player });
  }

  // Check password if room has password and not joining with matching password
  if (room.password && room.password.trim() !== '') {
    if (!password || password.trim() !== room.password.trim()) {
      return res.status(401).json({ error: 'Incorrect room password', requiresPassword: true });
    }
  }

  // Add player if not already present
  if (player) {
    const existingIndex = room.players.findIndex((p) => p.id === player.id);
    if (existingIndex >= 0) {
      // Update existing player details
      room.players[existingIndex] = {
        ...room.players[existingIndex],
        name: player.name || room.players[existingIndex].name,
        avatar: player.avatar || room.players[existingIndex].avatar,
      };
    } else {
      // New joining player
      room.players.push({
        id: player.id,
        name: player.name || `Player ${room.players.length + 1}`,
        avatar: player.avatar || '🦊',
        isHuman: true,
        isHost: false,
        score: 0,
        role: 'innocent',
        clue: '',
        hasSubmittedClue: false,
        votedForId: null,
        isReady: false,
      });
    }
  }

  room.lastActive = Date.now();
  // Notify other players in the room
  broadcastToRoom(roomId, {
    type: 'ROOM_STATE_SYNC',
    room,
  });

  res.json({ success: true, room });
});

// Fetch current room state
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ success: true, room });
});

// Update room state (sync from host or player action)
app.post('/api/rooms/:roomId/sync', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const { updates } = req.body;
  if (updates) {
    Object.assign(room, updates);
    room.lastActive = Date.now();
    broadcastToRoom(roomId, {
      type: 'ROOM_STATE_SYNC',
      room,
    });
  }

  res.json({ success: true, room });
});

// Update room settings (chameleon count, times, points, etc.)
app.post('/api/rooms/:roomId/settings', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const { settings } = req.body;
  if (settings) {
    room.settings = {
      ...room.settings,
      ...settings,
    };
    if (settings.roomPassword !== undefined) {
      room.password = settings.roomPassword;
    }
    room.lastActive = Date.now();
    broadcastToRoom(roomId, {
      type: 'ROOM_SETTINGS_UPDATED',
      settings: room.settings,
      room,
    });
  }

  res.json({ success: true, settings: room.settings, room });
});

// Add AI Bot to room
app.post('/api/rooms/:roomId/bot', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const { bot } = req.body;
  if (bot) {
    room.players.push(bot);
    room.lastActive = Date.now();
    broadcastToRoom(roomId, { type: 'ROOM_STATE_SYNC', room });
  }
  res.json({ success: true, room });
});

// Remove player from room
app.delete('/api/rooms/:roomId/players/:playerId', (req, res) => {
  const { roomId, playerId } = req.params;
  const room = rooms.get(roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  room.players = room.players.filter((p) => p.id !== playerId);
  room.lastActive = Date.now();
  broadcastToRoom(roomId, { type: 'ROOM_STATE_SYNC', room });
  res.json({ success: true, room });
});

// Kick off HTTP server & WebSockets
async function startServer() {
  const server = http.createServer(app);

  // Setup WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    // Parse query params if available
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const queryRoomId = url.searchParams.get('roomId');
    const queryPlayerId = url.searchParams.get('playerId');

    const meta: ClientMeta = {
      roomId: queryRoomId || undefined,
      playerId: queryPlayerId || undefined,
      isAlive: true,
    };
    clients.set(ws, meta);

    // Heartbeat pong listener
    ws.on('pong', () => {
      const m = clients.get(ws);
      if (m) m.isAlive = true;
    });

    ws.on('message', (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        if (!data || !data.type) return;

        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
          return;
        }

        if (data.type === 'JOIN_ROOM') {
          const { roomId, player, password } = data;
          meta.roomId = roomId;
          meta.playerId = player?.id;

          let room = rooms.get(roomId);
          if (!room) {
            // Create room on the fly
            room = {
              id: roomId,
              password: password || '',
              hostId: player?.id || 'host',
              gameMode: 'room',
              gamePhase: 'lobby',
              roundNumber: 1,
              players: player ? [{ ...player, isHost: true }] : [],
              selectedCategoryId: 'sports',
              settings: {
                pointForGuessingFox: true,
                foxSeeOneClueEarly: false,
                anonymousVoting: false,
                turnTimer: true,
                turnTimerSeconds: 60,
                privateGame: false,
                chameleonCount: 1,
                targetScore: 5,
                innocentCatchPoints: 2,
                chameleonEscapePoints: 2,
                chameleonStealPoints: 1,
                roomPassword: password || '',
              },
              createdAt: Date.now(),
              lastActive: Date.now(),
            };
            rooms.set(roomId, room);
          } else if (player) {
            const existing = room.players.find((p) => p.id === player.id);
            if (!existing) {
              room.players.push({
                ...player,
                isHost: room.players.length === 0,
                isHuman: true,
                score: 0,
                clue: '',
                hasSubmittedClue: false,
                votedForId: null,
                isReady: false,
              });
            }
          }

          // Send current state back to joining client
          ws.send(JSON.stringify({ type: 'ROOM_STATE_SYNC', room }));
          // Broadcast to all other peers in room
          broadcastToRoom(roomId, { type: 'ROOM_STATE_SYNC', room }, ws);
        } else if (data.type === 'STATE_SYNC') {
          const { roomId, updates } = data;
          if (roomId && updates) {
            const room = rooms.get(roomId);
            if (room) {
              Object.assign(room, updates);
              room.lastActive = Date.now();
              broadcastToRoom(roomId, { type: 'ROOM_STATE_SYNC', room });
            }
          }
        } else if (data.type === 'UPDATE_SETTINGS') {
          const { roomId, settings } = data;
          if (roomId && settings) {
            const room = rooms.get(roomId);
            if (room) {
              room.settings = { ...room.settings, ...settings };
              room.lastActive = Date.now();
              broadcastToRoom(roomId, { type: 'ROOM_SETTINGS_UPDATED', settings: room.settings, room });
            }
          }
        } else if (data.type === 'LEAVE_ROOM') {
          const { roomId, playerId } = data;
          if (roomId && playerId) {
            const room = rooms.get(roomId);
            if (room) {
              room.players = room.players.filter((p) => p.id !== playerId);
              broadcastToRoom(roomId, { type: 'ROOM_STATE_SYNC', room });
            }
          }
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Keep-alive ping interval every 25s
  const pingInterval = setInterval(() => {
    for (const [ws, meta] of clients.entries()) {
      if (!meta.isAlive) {
        ws.terminate();
        clients.delete(ws);
        continue;
      }
      meta.isAlive = false;
      ws.ping();
    }
  }, 25000);

  server.on('close', () => {
    clearInterval(pingInterval);
  });

  // Vite middleware in dev mode, static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Chameleon Realtime Game Server running on port ${PORT}`);
  });
}

startServer();
