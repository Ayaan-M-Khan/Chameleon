import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  LogIn,
  Bot,
  Smartphone,
  Globe,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Grid,
} from 'lucide-react';
import { GameMode } from '../types';

interface HomeViewProps {
  onCreateRoom: (playerName: string, avatar: string, mode: GameMode, customRoomId?: string, password?: string) => void;
  onJoinRoom: (roomId: string, playerName: string, avatar: string, password?: string) => void;
  onOpenRules: () => void;
  defaultRoomId: string;
  initialPassword?: string;
  initialJoinTab?: boolean;
}

const AVATARS = ['🦎', '🦊', '🕵️', '🦉', '🐱', '🐺', '🦁', '🐼', '🐵', '🐯', '🦅', '🐸'];

export const HomeView: React.FC<HomeViewProps> = ({
  onCreateRoom,
  onJoinRoom,
  onOpenRules,
  defaultRoomId = '',
  initialPassword = '',
  initialJoinTab = false,
}) => {
  const hasInviteRoom = Boolean(defaultRoomId && defaultRoomId.trim().length > 3);

  const [activeTab, setActiveTab] = useState<'create' | 'join'>(
    initialJoinTab || hasInviteRoom ? 'join' : 'create'
  );
  
  // Create Room state
  const [createName, setCreateName] = useState('Player 1');
  const [createAvatar, setCreateAvatar] = useState('🦎');
  const [createMode, setCreateMode] = useState<GameMode>('room');
  const [createPassword, setCreatePassword] = useState('');
  const [hasCustomPassword, setHasCustomPassword] = useState(false);

  // Join Room state - empty on normal startup unless invited
  const [joinRoomId, setJoinRoomId] = useState(hasInviteRoom ? defaultRoomId.trim() : '');
  const [joinPassword, setJoinPassword] = useState(initialPassword || '');
  const [joinName, setJoinName] = useState('Detective');
  const [joinAvatar, setJoinAvatar] = useState('🕵️');
  const [joinError, setJoinError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = createName.trim() || 'Player 1';
    onCreateRoom(
      finalName,
      createAvatar,
      createMode,
      undefined,
      hasCustomPassword && createPassword.trim() ? createPassword.trim() : undefined
    );
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedRoomId = joinRoomId.trim().toUpperCase();
    if (!cleanedRoomId) {
      setJoinError('Please enter a valid Game Room ID');
      return;
    }
    setJoinError('');
    const finalName = joinName.trim() || 'Guest';
    onJoinRoom(cleanedRoomId, finalName, joinAvatar, joinPassword.trim() || undefined);
  };

  const handleQuickSolo = () => {
    onCreateRoom(createName.trim() || 'Player 1', createAvatar, 'solo');
  };

  const handleQuickPassAndPlay = () => {
    onCreateRoom(createName.trim() || 'Player 1', createAvatar, 'pass_and_play');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Social Deduction Word Game</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase drop-shadow-md">
          🕵️ <span className="text-emerald-400">The Infiltrator</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Blend in. Give deceptive clues. Find the secret code or hunt down the impostor before they escape!
        </p>
      </div>

      {/* Main Action Hub Card */}
      <div className="retro-card rounded-2xl bg-[#131B2E] border-2 border-slate-700 shadow-xl overflow-hidden">
        {/* Navigation Tabs: Create vs Join */}
        <div className="grid grid-cols-2 border-b-2 border-slate-700 bg-slate-900/90 text-sm font-display font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-4 px-4 flex items-center justify-center gap-2 transition-colors border-r-2 border-slate-700 ${
              activeTab === 'create'
                ? 'bg-[#131B2E] text-emerald-400 border-b-2 border-b-emerald-400 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Create a Room</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('join')}
            className={`py-4 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'join'
                ? 'bg-[#131B2E] text-amber-400 border-b-2 border-b-amber-400 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>Join a Room</span>
          </button>
        </div>

        {/* Tab 1: Create Room Content */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="p-5 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Player Identity */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Player Nickname
                  </label>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    onBlur={() => {
                      if (!createName.trim()) {
                        setCreateName('Player 1');
                      }
                    }}
                    maxLength={20}
                    placeholder="Player 1"
                    className="w-full px-4 py-3 bg-slate-900/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Choose Your Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setCreateAvatar(av)}
                        className={`text-2xl p-2 rounded-lg transition-all flex items-center justify-center ${
                          createAvatar === av
                            ? 'bg-emerald-500/30 border-2 border-emerald-400 scale-110 shadow-sm'
                            : 'hover:bg-slate-800 border border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Game Mode Selection */}
              <div className="space-y-4">
                <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Choose Game Experience
                </label>

                <div className="space-y-2.5">
                  {/* Option 1: Online Multiplayer */}
                  <label
                    onClick={() => setCreateMode('room')}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      createMode === 'room'
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gameMode"
                      checked={createMode === 'room'}
                      onChange={() => setCreateMode('room')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span className="font-display font-extrabold text-sm text-white uppercase">
                          Online Room (Multiplayer)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Creates a room with a shareable Game Code. Friends join from their own devices.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Solo vs AI Bots */}
                  <label
                    onClick={() => setCreateMode('solo')}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      createMode === 'solo'
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gameMode"
                      checked={createMode === 'solo'}
                      onChange={() => setCreateMode('solo')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-400" />
                        <span className="font-display font-extrabold text-sm text-white uppercase">
                          Solo vs AI Bots
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Play right away against 3 simulated bots (Detective Hazel, Owl, etc.) with smart deduction logic.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Pass & Play */}
                  <label
                    onClick={() => setCreateMode('pass_and_play')}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      createMode === 'pass_and_play'
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gameMode"
                      checked={createMode === 'pass_and_play'}
                      onChange={() => setCreateMode('pass_and_play')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span className="font-display font-extrabold text-sm text-white uppercase">
                          Pass & Play (Local Party)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Play on one shared laptop or tablet with private turn-screens for each player.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Optional Room Password for Online Multiplayer */}
                {createMode === 'room' && (
                  <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCustomPassword}
                        onChange={(e) => setHasCustomPassword(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-300">
                        Set Room Passcode / Password (Optional)
                      </span>
                    </label>

                    {hasCustomPassword && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          placeholder="e.g. 1234 or SECRET"
                          maxLength={16}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-hidden focus:border-emerald-400"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          The share link will auto-complete this password for your friends.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Default room setup will generate 4 ready player slots</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto retro-button px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform"
              >
                <span>Create Room & Enter Lobby</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Join Room Content */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoinSubmit} className="p-5 sm:p-8 space-y-6">
            <div className="max-w-xl mx-auto space-y-5">
              {/* Invite Link Detection Notice */}
              {hasInviteRoom && defaultRoomId && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">Direct Invite Detected: </span>
                    Room code <code className="bg-emerald-900 px-1 py-0.5 rounded font-mono font-bold text-yellow-300">{defaultRoomId}</code>
                    {initialPassword ? ' and password have been auto-completed!' : ' has been auto-completed!'}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Game Room ID / Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => {
                      setJoinRoomId(e.target.value.toUpperCase());
                      setJoinError('');
                    }}
                    placeholder="e.g. CHAM-8421"
                    maxLength={16}
                    className="w-full px-4 py-3.5 bg-slate-900/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-mono font-bold text-lg uppercase tracking-wider focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                  />
                  {hasInviteRoom && defaultRoomId && (
                    <button
                      type="button"
                      onClick={() => setJoinRoomId(defaultRoomId)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono font-bold border border-slate-600"
                    >
                      Paste Invite Code
                    </button>
                  )}
                </div>
                {joinError && (
                  <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{joinError}</span>
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Ask the room host for the 8-character Game ID shown at the top of their screen.
                </p>
              </div>

              {/* Room Passcode / Password input (auto-completed if in invite link) */}
              <div>
                <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Room Passcode / Password (Optional)</span>
                  {joinPassword && (
                    <span className="text-[11px] text-emerald-400 font-mono font-normal">
                      ✓ Auto-completed from invite link
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Enter passcode if required by host..."
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slate-900/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-mono text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Player Name
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    onBlur={() => {
                      if (!joinName.trim()) {
                        setJoinName('Player');
                      }
                    }}
                    maxLength={20}
                    placeholder="Player"
                    className="w-full px-4 py-3 bg-slate-900/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-display font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-1.5 bg-slate-900/70 p-2 rounded-xl border border-slate-700">
                    {AVATARS.slice(0, 6).map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setJoinAvatar(av)}
                        className={`text-xl p-1.5 rounded-lg transition-all flex items-center justify-center ${
                          joinAvatar === av
                            ? 'bg-amber-400/30 border-2 border-amber-400 scale-105'
                            : 'hover:bg-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full retro-button px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Join Game Room</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Quick Launch & How to Play Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Card 1: Instant Solo */}
        <div
          onClick={handleQuickSolo}
          className="retro-card p-4 rounded-xl bg-slate-900/80 border-2 border-slate-700 hover:border-emerald-500/70 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🤖
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-emerald-400 transition-colors">
                Instant Solo Game
              </h4>
              <p className="text-xs text-slate-400">Play immediately with AI bots</p>
            </div>
          </div>
        </div>

        {/* Quick Card 2: Pass & Play */}
        <div
          onClick={handleQuickPassAndPlay}
          className="retro-card p-4 rounded-xl bg-slate-900/80 border-2 border-slate-700 hover:border-cyan-500/70 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📱
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-cyan-400 transition-colors">
                Pass & Play Mode
              </h4>
              <p className="text-xs text-slate-400">Party game on one screen</p>
            </div>
          </div>
        </div>

        {/* Quick Card 3: Game Rules */}
        <div
          onClick={onOpenRules}
          className="retro-card p-4 rounded-xl bg-slate-900/80 border-2 border-slate-700 hover:border-amber-400/70 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📖
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-amber-400 transition-colors">
                How to Play Rules
              </h4>
              <p className="text-xs text-slate-400">Learn rules in 1 minute</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Snapshot for Instant Onboarding */}
      <div className="bg-[#131B2E] border-2 border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-black text-sm sm:text-base text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Grid className="w-4 h-4 text-emerald-400" />
          <span>Game Overview & Mechanics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 text-[11px] inline-block">
              01 • SECRET CODE
            </span>
            <h5 className="font-display font-bold text-white text-xs uppercase">The 4×4 Matrix</h5>
            <p className="text-slate-400 leading-relaxed">
              A 16-word topic card is revealed. Everyone sees the secret coordinate (e.g. <strong>C2</strong>), except The Infiltrator!
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 text-[11px] inline-block">
              02 • GIVE CLUES
            </span>
            <h5 className="font-display font-bold text-white text-xs uppercase">Blend In Or Deduce</h5>
            <p className="text-slate-400 leading-relaxed">
              Each player writes a clue (up to 80 chars). Innocents prove their knowledge subtly; The Infiltrator fakes it to blend in.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/80 text-[11px] inline-block">
              03 • ACCUSE & ESCAPE
            </span>
            <h5 className="font-display font-bold text-white text-xs uppercase">Vote Out The Impostor</h5>
            <p className="text-slate-400 leading-relaxed">
              Debate and vote! If The Infiltrator is accused, they get one final chance to inspect all hints and guess the secret word to steal the win!
            </p>
          </div>
        </div>

      </div>

      {/* CREATOR FOOTER REFERENCE (Appears only at the bottom of the page) */}
      <footer id="app-creator-footer" className="w-full max-w-5xl mx-auto px-4 py-4 text-center border-t border-slate-800/80 mt-8 mb-2">
        <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
          <span>Created by</span>
          <span className="font-bold text-amber-300 font-display uppercase tracking-wider bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/80 text-xs">
            Ayaan Khan
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">The Infiltrator Social Deduction Game</span>
        </p>
      </footer>
    </div>
  );
};
