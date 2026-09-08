import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, Settings, LogOut, Users, Bot, Share2, Check, Copy, X, UserMinus } from 'lucide-react';
import { GameMode, GamePhase, Player } from '../types';
import { buildRoomInviteUrl } from '../utils/inviteUrl';

interface HeaderBarProps {
  roomId: string;
  gameMode: GameMode;
  gamePhase: GamePhase;
  roundNumber: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenOptions: () => void;
  onOpenRules: () => void;
  onLeaveRoom: () => void;
  peerCount: number;
  roomPassword?: string;
  players?: Player[];
  isHost?: boolean;
  myPlayerId?: string;
  onKickPlayer?: (playerId: string) => void;
  onOpenOddsBooster?: () => void;
  myInfiltratorOdds?: number;
  myInfiltratorBoostGold?: number;
  myChameleonOdds?: number;
  myChameleonBoostGold?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  roomId,
  gameMode,
  gamePhase,
  roundNumber,
  soundEnabled,
  onToggleSound,
  onOpenOptions,
  onOpenRules,
  onLeaveRoom,
  peerCount,
  roomPassword,
  players = [],
  isHost = false,
  myPlayerId,
  onKickPlayer,
  onOpenOddsBooster,
  myInfiltratorOdds,
  myInfiltratorBoostGold,
  myChameleonOdds,
  myChameleonBoostGold,
}) => {
  const displayOdds = myInfiltratorOdds ?? myChameleonOdds;
  const displayBoostGold = myInfiltratorBoostGold ?? myChameleonBoostGold;
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRoomListOpen, setIsRoomListOpen] = useState(false);
  const roomDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(e.target as Node)) {
        setIsRoomListOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRoomListOpen(false);
      }
    };

    if (isRoomListOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRoomListOpen]);

  // Click on code -> copies room code only
  const handleCopyCode = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  // Click on copy link -> copies full invite URL
  const handleCopyLink = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const inviteUrl = buildRoomInviteUrl(roomId, roomPassword);
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const isInGame = gamePhase !== 'home' && gamePhase !== 'lobby';
  const isInRoom = gamePhase !== 'home';

  return (
    <header className="w-full bg-[#0D1322]/95 border-b-2 border-slate-800 px-3 sm:px-4 py-2.5 shadow-md sticky top-0 z-40 backdrop-blur-sm text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left section: Leave Game (only in game) & Game ID */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo brand for Home page */}
          {gamePhase === 'home' && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🕵️</span>
              <span className="font-display font-black text-sm uppercase tracking-wider text-emerald-400">
                The Infiltrator
              </span>
            </div>
          )}

          {/* Leave Room / Game button (ONLY appears when actually in a game) */}
          {isInGame && (
            <button
              onClick={onLeaveRoom}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-950/40 border border-slate-700 shadow-xs cursor-pointer"
              title="Leave current game / Return to Homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Leave Game</span>
            </button>
          )}

          {isInGame && <span className="text-slate-600 font-mono">|</span>}

          {/* Game ID Badge with distinct Code click & Copy Link button (when in room/game) */}
          {isInRoom && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-xs">
              <span className="text-slate-400 select-none">Code:</span>
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                  copiedCode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-slate-700/80 border border-transparent'
                }`}
                title={`Click code to copy "${roomId}"`}
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-sans font-bold text-emerald-300">Code Copied!</span>
                  </>
                ) : (
                  <>
                    <span>{roomId}</span>
                    <Copy className="w-3 h-3 text-slate-400 hover:text-amber-300" />
                  </>
                )}
              </button>

              <span className="text-slate-600 select-none">|</span>

              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-700'
                }`}
                title="Copy full invite link (auto-completes code & password)"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-sans font-bold text-emerald-300">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    <span className="text-[10px] font-sans font-medium text-slate-300 hover:text-white">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isInRoom && <span className="text-slate-600 font-mono hidden sm:inline">|</span>}

          {/* Connection status indicator */}
          {isInRoom && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 hidden md:inline">
                {gameMode === 'solo' && 'Local Solo (AI Active)'}
                {gameMode === 'pass_and_play' && 'Pass & Play'}
                {gameMode === 'room' && `Online (${peerCount + 1} connected)`}
              </span>
            </div>
          )}
        </div>

        {/* Center: Brand / Round Indicator */}
        {gamePhase !== 'home' && (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded text-xs tracking-wider uppercase border border-slate-900 shadow-xs">
              🕵️ INFILTRATOR
            </div>
            {isInGame && (
              <span className="text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
                ROUND {roundNumber}
              </span>
            )}
          </div>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Room Button on Top Right: Only appears when in a room, shows all people in the room */}
          {isInRoom && (
            <div className="relative" ref={roomDropdownRef}>
              <button
                onClick={() => setIsRoomListOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-xs ${
                  isRoomListOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-800/90 text-amber-300 hover:text-white hover:bg-slate-700 border-slate-700 hover:border-amber-400/50'
                }`}
                title="View all people in this room"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Room</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isRoomListOpen ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300'
                  }`}
                >
                  {players.length}
                </span>
              </button>

              {/* Popover showing all people in room */}
              {isRoomListOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0F172A] border-2 border-slate-700 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <h3 className="font-display font-extrabold text-sm uppercase text-white tracking-wide">
                        People in Room ({players.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsRoomListOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Room Info Bar inside Dropdown */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono mb-3">
                    <span className="text-slate-400">Room Code:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyCode}
                        className="font-bold text-amber-300 hover:text-amber-200 px-1.5 py-0.5 rounded hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Click to copy room code"
                      >
                        {copiedCode ? '✓ Copied' : roomId}
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="text-[10px] font-sans px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                        title="Copy direct invite link"
                      >
                        {copiedLink ? '✓ Link Copied' : 'Copy Link'}
                      </button>
                    </div>
                  </div>

                  {/* Player Roster */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{player.avatar}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-white truncate">{player.name}</span>
                              {player.isHost && (
                                <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded font-bold">
                                  HOST
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              {player.isHuman ? 'Human Player' : 'AI Bot'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {player.score} pts
                          </span>
                          {isHost && player.id !== myPlayerId && onKickPlayer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to kick ${player.name} from the party?`)) {
                                  onKickPlayer(player.id);
                                }
                              }}
                              className="p-1 px-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/70 border border-rose-800/40 hover:border-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                              title={`Kick ${player.name} from party`}
                            >
                              <UserMinus className="w-3 h-3" />
                              <span>Kick</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions inside Popover */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{copiedLink ? 'Link Copied!' : 'Invite Friends'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsRoomListOpen(false);
                        onLeaveRoom();
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Leave this room and return to homepage"
                    >
                      <LogOut className="w-3 h-3 text-rose-400" />
                      <span>Leave</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode Pill (when in room/game) */}
          {isInRoom && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              {gameMode === 'solo' ? <Bot className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="capitalize">{gameMode.replace('_', ' ')}</span>
            </div>
          )}

          {/* Infiltrator Odds Booster Quick Trigger */}
          {isInRoom && onOpenOddsBooster && (
            <button
              onClick={onOpenOddsBooster}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border border-amber-500/60 shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
              title="Boost your chances of drawing The Infiltrator role in upcoming rounds with gold!"
            >
              <span className="text-sm select-none">🕵️</span>
              <span className="hidden sm:inline">Odds:</span>
              <span className="text-yellow-300">
                {displayOdds !== undefined ? `${displayOdds.toFixed(1)}%` : 'Odds'}
              </span>
              {displayBoostGold && displayBoostGold > 0 ? (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1 rounded font-black">
                  +{Math.floor(displayBoostGold / 50)} 🎟️
                </span>
              ) : null}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Rules Modal */}
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            title="How to play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Game Options Panel */}
          <button
            onClick={onOpenOptions}
            className="flex items-center gap-1 p-1.5 px-2.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 border border-emerald-500 transition-all shadow-xs cursor-pointer"
            title="Game Options"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Options</span>
          </button>
        </div>
      </div>
    </header>
  );
};
