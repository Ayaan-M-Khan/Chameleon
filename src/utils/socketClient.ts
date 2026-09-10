import { GameSettings, Player } from '../types';

export type SocketEventHandler = (data: any) => void;
export type SocketConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export interface CachedSession {
  roomId: string;
  playerId: string;
  sessionToken: string;
  playerName?: string;
  playerAvatar?: string;
  savedAt: number;
}

const SESSION_STORAGE_KEY = 'the_infiltrator_multiplayer_session';

class RealtimeSocketClient {
  private ws: WebSocket | null = null;
  private roomId: string = '';
  private playerId: string = '';
  private sessionToken: string = '';
  private player: Player | null = null;
  private password?: string;
  private listeners: Set<SocketEventHandler> = new Set();
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private isConnecting: boolean = false;
  private isReconnectingSession: boolean = false;
  private pollInterval: any = null;
  private isManualDisconnect: boolean = false;
  private reconnectAttempts = 0;
  private connectionState: SocketConnectionState = 'idle';
  private readonly reconnectBaseDelay = 500;
  private readonly reconnectMaxDelay = 30000;

  public getState(): SocketConnectionState {
    return this.connectionState;
  }

  public getSessionToken(): string {
    return this.sessionToken;
  }

  public getCachedSession(): CachedSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedSession;
      if (parsed?.roomId && parsed?.playerId && parsed?.sessionToken) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached session:', e);
    }
    return null;
  }

  public saveSession(roomId: string, player: Player, sessionToken?: string): string {
    if (typeof window === 'undefined' || !roomId || !player?.id) return '';
    try {
      const token =
        sessionToken ||
        player.sessionToken ||
        this.sessionToken ||
        `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.sessionToken = token;
      player.sessionToken = token;
      const sessionData: CachedSession = {
        roomId,
        playerId: player.id,
        sessionToken: token,
        playerName: player.name,
        playerAvatar: player.avatar,
        savedAt: Date.now(),
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      // Store individual credentials requested for automatic session restoration
      sessionStorage.setItem('fox_room_id', roomId);
      sessionStorage.setItem('fox_player_id', player.id);
      if (player.name) sessionStorage.setItem('fox_player_name', player.name);
      return token;
    } catch (e) {
      console.warn('Failed to save session to sessionStorage:', e);
      return '';
    }
  }

  public clearSession() {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('fox_room_id');
      sessionStorage.removeItem('fox_player_id');
      sessionStorage.removeItem('fox_player_name');
    } catch (e) {}
    this.sessionToken = '';
    this.isReconnectingSession = false;
  }

  private setConnectionState(state: SocketConnectionState) {
    if (this.connectionState === state) return;
    this.connectionState = state;
    this.emit({ type: 'SOCKET_STATE', state });
  }

  public connect(roomId: string, player: Player, password?: string) {
    this.disconnect();
    this.roomId = roomId;
    this.playerId = player.id;
    this.player = player;
    this.password = password;

    const token = this.saveSession(roomId, player);
    this.sessionToken = token;
    this.isReconnectingSession = false;

    this.isManualDisconnect = false;
    this.reconnectAttempts = 0;
    this.setConnectionState('connecting');
    this.initWebSocket();
    this.startPollingFallback();
  }

  public reconnectSession(roomId: string, playerId: string, sessionToken: string, existingPlayer?: Player) {
    this.disconnect(false);
    this.roomId = roomId;
    this.playerId = playerId;
    this.sessionToken = sessionToken;
    this.player =
      existingPlayer ||
      this.player ||
      ({
        id: playerId,
        name: 'Reconnecting...',
        avatar: '🦊',
        isHuman: true,
        isHost: false,
        score: 0,
        role: 'innocent',
        clue: '',
        hasSubmittedClue: false,
        votedForId: null,
        isReady: false,
        sessionToken,
      } as Player);
    this.isReconnectingSession = true;
    this.isManualDisconnect = false;
    this.reconnectAttempts = 0;
    this.setConnectionState('connecting');
    this.initWebSocket();
    this.startPollingFallback();
  }

  public disconnect(clearCache: boolean = true) {
    this.isManualDisconnect = true;
    if (clearCache) {
      this.isReconnectingSession = false;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.ws) {
      try {
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
      } catch (e) {
        // ignore
      }
      this.ws = null;
    }
    this.setConnectionState('disconnected');
  }

  public subscribe(handler: SocketEventHandler): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  private emit(data: any) {
    this.listeners.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error('Error in socket event handler:', err);
      }
    });
  }

  private initWebSocket() {
    if (typeof window === 'undefined') return;
    if (!this.roomId) return;

    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
    this.isConnecting = true;
    this.setConnectionState(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const wsProtocol = isSecure ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
    const wsUrl = `${wsProtocol}//${host}/ws?roomId=${encodeURIComponent(this.roomId)}&playerId=${encodeURIComponent(
      this.playerId
    )}`;

    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        if (this.ws !== socket) return;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');

        // Check sessionStorage for stored session credentials
        const savedRoomId = typeof window !== 'undefined'
          ? (sessionStorage.getItem('fox_room_id') || sessionStorage.getItem('infiltrator_room_id') || this.roomId)
          : this.roomId;
        const savedPlayerId = typeof window !== 'undefined'
          ? (sessionStorage.getItem('fox_player_id') || sessionStorage.getItem('infiltrator_player_id') || this.playerId)
          : this.playerId;
        const savedPlayerName = typeof window !== 'undefined'
          ? (sessionStorage.getItem('fox_player_name') || sessionStorage.getItem('infiltrator_player_name') || this.player?.name || 'Player')
          : (this.player?.name || 'Player');

        // Automatic session restoration or rejoin
        if (this.isReconnectingSession || (this.sessionToken && this.reconnectAttempts > 0) || (savedRoomId && savedPlayerId)) {
          this.send({
            type: 'RECONNECT_SESSION',
            roomId: savedRoomId || this.roomId,
            playerId: savedPlayerId || this.playerId,
            playerName: savedPlayerName,
            sessionToken: this.sessionToken,
          });
          this.isReconnectingSession = false;
        } else {
          // Standard JOIN_ROOM message
          this.send({
            type: 'JOIN_ROOM',
            roomId: this.roomId,
            player: {
              ...this.player,
              sessionToken: this.sessionToken,
            },
            password: this.password,
          });
        }

        // Start client keepalive ping interval every 20s if WebSocket is open
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type !== 'PONG') {
            if (data.type === 'SESSION_RECONNECTED' && data.room) {
              const myPlayer = data.room.players?.find((p: any) => p.id === this.playerId);
              if (myPlayer) {
                this.saveSession(this.roomId, myPlayer, this.sessionToken);
              }
            } else if (data.type === 'SESSION_RECONNECT_FAILED') {
              console.warn('Session reconnection failed:', data.reason);
              this.clearSession();
            }
            this.emit(data);
          }
        } catch (e) {
          console.error('Failed to parse socket message:', e);
        }
      };

      socket.onclose = () => {
        if (this.ws !== socket) return;
        this.ws = null;
        this.isConnecting = false;
        if (this.pingInterval) clearInterval(this.pingInterval);
        // Do not reconnect if manually disconnected or no roomId
        if (this.isManualDisconnect || !this.roomId) {
          return;
        }
        this.scheduleReconnect();
      };

      socket.onerror = (err) => {
        console.warn('WebSocket error, falling back to polling:', err);
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      };
    } catch (e) {
      console.warn('Failed to construct WebSocket, relying on HTTP API:', e);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.isManualDisconnect || !this.roomId || this.reconnectTimeout) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 10000);
    this.reconnectAttempts += 1;
    this.setConnectionState('reconnecting');
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (!this.isManualDisconnect && this.roomId) this.initWebSocket();
    }, delay);
  }

  public send(data: any) {
    if (!data) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (err) {
        console.error('Error sending message over WebSocket:', err);
      }
    }
  }

  public sendReaction(roomId: string, playerId: string, emoji: string) {
    this.send({
      type: 'EMOJI_REACTION',
      roomId,
      playerId,
      emoji,
    });
  }

  public usePotion(roomId: string, playerId: string, potionId: string, extra?: Record<string, any>) {
    this.send({
      type: 'USE_POTION',
      roomId,
      playerId,
      potionId,
      ...(extra || {}),
    });
  }

  // Polling fallback every 3 seconds to guarantee freshness
  private startPollingFallback() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      if (this.isManualDisconnect || !this.roomId) return;
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(this.roomId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.room && !this.isManualDisconnect && this.roomId) {
            this.emit({ type: 'ROOM_STATE_SYNC', room: data.room });
          }
        }
      } catch (err) {
        // network silent catch
      }
    }, 3000);
  }

  // REST API Methods for guaranteed delivery
  public async createRoom(
    roomId: string,
    hostPlayer: Player,
    settings: GameSettings,
    gameMode: string,
    selectedCategoryId: string,
    password?: string
  ) {
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, hostPlayer, settings, gameMode, selectedCategoryId, password }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating room on server:', err);
      return null;
    }
  }

  public async joinRoom(roomId: string, player: Player, password?: string) {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player, password }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error joining room on server:', err);
      return null;
    }
  }

  public async updateSettings(roomId: string, settings: Partial<GameSettings>) {
    // Send via socket
    this.send({
      type: 'UPDATE_SETTINGS',
      roomId,
      settings,
    });
    // And sync via REST API
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
    } catch (err) {
      console.error('Error updating settings on server:', err);
    }
  }

  public async syncState(roomId: string, updates: any) {
    // Send via socket
    this.send({
      type: 'STATE_SYNC',
      roomId,
      updates,
    });
    // And sync via REST API
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
    } catch (err) {
      console.error('Error syncing room state:', err);
    }
  }

  public async addBot(roomId: string, bot: Player) {
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot }),
      });
    } catch (err) {
      console.error('Error adding bot on server:', err);
    }
  }

  public async kickPlayer(roomId: string, playerId: string) {
    this.send({
      type: 'KICK_PLAYER',
      roomId,
      playerId,
    });
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/players/${encodeURIComponent(playerId)}?kick=true`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error kicking player on server:', err);
    }
  }

  public async removePlayer(roomId: string, playerId: string) {
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/players/${encodeURIComponent(playerId)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error removing player on server:', err);
    }
  }

  public async leaveRoom(roomId: string, playerId: string) {
    const targetRoomId = roomId || this.roomId;
    const targetPlayerId = playerId || this.playerId;

    try {
      this.send({
        type: 'LEAVE_ROOM',
        roomId: targetRoomId,
        playerId: targetPlayerId,
      });
    } catch (e) {}

    // Immediately wipe internal room association and cached session
    this.clearSession();
    this.roomId = '';
    this.playerId = '';
    this.player = null;
    this.password = undefined;
    this.disconnect();

    if (targetRoomId && targetPlayerId) {
      try {
        await fetch(`/api/rooms/${encodeURIComponent(targetRoomId)}/players/${encodeURIComponent(targetPlayerId)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Error leaving room on server:', err);
      }
    }
  }

  public async reconnectSessionRest(roomId: string, playerId: string, sessionToken: string) {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/reconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, sessionToken }),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error('Error reconnecting session via REST:', err);
      return null;
    }
  }
}

export const socketClient = new RealtimeSocketClient();
