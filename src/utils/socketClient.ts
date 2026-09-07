import { GameSettings, Player } from '../types';

export type SocketEventHandler = (data: any) => void;

class RealtimeSocketClient {
  private ws: WebSocket | null = null;
  private roomId: string = '';
  private playerId: string = '';
  private player: Player | null = null;
  private password?: string;
  private listeners: Set<SocketEventHandler> = new Set();
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private isConnecting: boolean = false;
  private pollInterval: any = null;

  public connect(roomId: string, player: Player, password?: string) {
    this.roomId = roomId;
    this.playerId = player.id;
    this.player = player;
    this.password = password;

    this.disconnect();
    this.initWebSocket();
    this.startPollingFallback();
  }

  public disconnect() {
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
        this.ws.close();
      } catch (e) {
        // ignore
      }
      this.ws = null;
    }
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

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?roomId=${encodeURIComponent(this.roomId)}&playerId=${encodeURIComponent(
      this.playerId
    )}`;

    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        this.isConnecting = false;
        // Send JOIN_ROOM message
        this.send({
          type: 'JOIN_ROOM',
          roomId: this.roomId,
          player: this.player,
          password: this.password,
        });

        // Start ping heartbeat every 20s
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
            this.emit(data);
          }
        } catch (e) {
          console.error('Failed to parse socket message:', e);
        }
      };

      socket.onclose = () => {
        this.ws = null;
        if (this.pingInterval) clearInterval(this.pingInterval);
        // Attempt reconnect after 3 seconds
        this.reconnectTimeout = setTimeout(() => {
          if (this.roomId) {
            this.initWebSocket();
          }
        }, 3000);
      };

      socket.onerror = (err) => {
        console.warn('WebSocket error, falling back to polling:', err);
        socket.close();
      };
    } catch (e) {
      console.warn('Failed to construct WebSocket, relying on HTTP API:', e);
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Polling fallback every 3 seconds to guarantee freshness
  private startPollingFallback() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      if (!this.roomId) return;
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(this.roomId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.room) {
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
    this.send({
      type: 'LEAVE_ROOM',
      roomId,
      playerId,
    });
    this.disconnect();
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}/players/${encodeURIComponent(playerId)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error leaving room on server:', err);
    }
  }
}

export const socketClient = new RealtimeSocketClient();
