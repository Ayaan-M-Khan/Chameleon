/**
 * Utility for creating and parsing direct room invite URLs.
 * Enables auto-joining a lobby with auto-completed room ID and password.
 */

export interface InviteParams {
  roomId: string | null;
  password: string | null;
  autoJoin: boolean;
}

export function buildRoomInviteUrl(roomId: string, password?: string): string {
  if (typeof window === 'undefined') return '';
  
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('room', roomId);
  params.set('join', '1');
  if (password && password.trim()) {
    params.set('pwd', password.trim());
  }
  
  return `${origin}${pathname}?${params.toString()}#${roomId}`;
}

export function parseInviteUrl(): InviteParams {
  if (typeof window === 'undefined') {
    return { roomId: null, password: null, autoJoin: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const rawHash = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
  const hashRoom = rawHash && (rawHash.startsWith('CHAM-') || rawHash.startsWith('FOX-')) ? rawHash : null;
  
  const roomParam = searchParams.get('room') || searchParams.get('roomId') || hashRoom;
  const pwdParam = searchParams.get('pwd') || searchParams.get('password') || null;
  const joinParam = searchParams.get('join') === '1' || searchParams.get('join') === 'true' || Boolean(searchParams.get('room'));

  return {
    roomId: roomParam ? roomParam.toUpperCase() : null,
    password: pwdParam,
    autoJoin: joinParam,
  };
}
