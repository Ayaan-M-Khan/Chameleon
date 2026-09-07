import React from 'react';
import {
  Users,
  Bot,
  Plus,
  Trash2,
  Play,
  Dices,
  Shield,
  Settings,
  Shuffle,
  HelpCircle,
  Share2,
  Check,
  Copy,
  LogOut,
  Clock,
  Trophy,
  Sparkles,
  Eye,
  ShieldCheck,
  Lock,
  Target,
  ListFilter,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from 'lucide-react';
import { Category, GameMode, GameSettings, Player } from '../types';
import { CATEGORIES } from '../data/categories';
import { buildRoomInviteUrl } from '../utils/inviteUrl';

interface LobbyViewProps {
  players: Player[];
  gameMode: GameMode;
  onSelectGameMode?: (mode: GameMode) => void;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddBot: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
  onStartGame: () => void;
  onOpenOptions: () => void;
  onOpenRules: () => void;
  settings: GameSettings;
  onUpdateSettings?: (newSettings: Partial<GameSettings>) => void;
  roomId: string;
  onLeaveRoom?: () => void;
  isHost?: boolean;
  myPlayerId?: string;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  players,
  gameMode,
  selectedCategoryId,
  onSelectCategory,
  onAddBot,
  onRemovePlayer,
  onUpdatePlayerName,
  onStartGame,
  onOpenOptions,
  onOpenRules,
  settings,
  onUpdateSettings,
  roomId,
  onLeaveRoom,
  isHost = true,
  myPlayerId,
}) => {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedInvite, setCopiedInvite] = React.useState(false);
  const canStart = players.length >= 3;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = buildRoomInviteUrl(roomId, settings.roomPassword);
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2200);
  };

  const handleSettingChange = (updates: Partial<GameSettings>) => {
    if (onUpdateSettings) {
      onUpdateSettings(updates);
    }
  };

  const timerDurations = [30, 45, 60, 90, 120];
  const targetScores = [5, 8, 10, 15, 0];

  const [deckMode, setDeckMode] = React.useState<'random' | 'select_one' | 'select_random'>(() => {
    if (settings.categoryDeckMode) return settings.categoryDeckMode;
    return selectedCategoryId === 'random' ? 'random' : 'select_one';
  });

  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = React.useState(false);
  const [poolSearchQuery, setPoolSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (settings.categoryDeckMode) {
      setDeckMode(settings.categoryDeckMode);
    } else if (selectedCategoryId === 'random') {
      setDeckMode('random');
    } else {
      setDeckMode('select_one');
    }
  }, [settings.categoryDeckMode, selectedCategoryId]);

  const activePool: string[] = React.useMemo(() => {
    if (settings.categoryPool && settings.categoryPool.length > 0) {
      return settings.categoryPool;
    }
    return CATEGORIES.map((c) => c.id);
  }, [settings.categoryPool]);

  const handleToggleCategoryInPool = (catId: string) => {
    let next: string[];
    if (activePool.includes(catId)) {
      next = activePool.filter((id) => id !== catId);
    } else {
      next = [...activePool, catId];
    }
    handleSettingChange({ categoryPool: next });
  };

  const handleSelectAllPool = () => {
    handleSettingChange({ categoryPool: CATEGORIES.map((c) => c.id) });
  };

  const handleDeselectAllPool = () => {
    handleSettingChange({ categoryPool: [] });
  };

  const selectedCategoryObj = React.useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  }, [selectedCategoryId]);

  const filteredCategoriesForPool = React.useMemo(() => {
    if (!poolSearchQuery.trim()) return CATEGORIES;
    const q = poolSearchQuery.toLowerCase();
    return CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [poolSearchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Brand Hero Card */}
      <div className="retro-card rounded-2xl p-6 sm:p-8 bg-[#131B2E] border-2 border-slate-700 text-center relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-widest border border-emerald-500/40 shadow-xs mb-3">
          <span>Board Game Classic • 4×4 Matrix Deduction</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
          🦎 THE CHAMELEON
        </h1>
        <p className="max-w-xl mx-auto mt-2 text-sm sm:text-base text-slate-300 font-medium">
          Find the impostor before they blend in and deduce the secret coordinate. One Chameleon. One 4×4 matrix. One subtle clue per player.
        </p>

        {/* Selected Game Mode Info Badge & Room Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm font-display font-bold text-slate-200 shadow-sm">
            {gameMode === 'solo' && <Bot className="w-4 h-4 text-emerald-400" />}
            {gameMode === 'pass_and_play' && <Users className="w-4 h-4 text-cyan-400" />}
            {gameMode === 'room' && <Shield className="w-4 h-4 text-purple-400" />}
            <span>
              Game Mode:{' '}
              <strong className="text-emerald-400 uppercase tracking-wider">
                {gameMode === 'solo'
                  ? 'Local Solo vs AI'
                  : gameMode === 'pass_and_play'
                  ? 'Pass & Play'
                  : 'Room Multiplayer'}
              </strong>
            </span>
          </div>

          {gameMode === 'room' && (
            <>
              {/* Copy Code button */}
              <button
                onClick={handleCopyCode}
                className={`retro-button px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all ${
                  copiedCode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-400/50'
                }`}
                title={`Click to copy room code "${roomId}"`}
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
                <span>{copiedCode ? 'Code Copied!' : `Code: ${roomId}`}</span>
              </button>

              {/* Copy Link button */}
              <button
                onClick={handleCopyInviteLink}
                className="retro-button px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-all"
                title="Copy full invite link to share with friends"
              >
                {copiedInvite ? <Check className="w-4 h-4 text-emerald-950" /> : <Share2 className="w-4 h-4 text-slate-950" />}
                <span>{copiedInvite ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </>
          )}

          {/* Leave Room button in lobby */}
          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="retro-button px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider bg-slate-900/90 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              title="Leave room and return to homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Leave Room</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Players & Roster */}
        <div className="retro-card rounded-2xl p-5 bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="font-display font-extrabold text-base sm:text-lg uppercase text-white">
                  Player Roster ({players.length}/8)
                </h2>
              </div>

              {players.length < 8 && (
                <button
                  onClick={onAddBot}
                  className="retro-button px-2.5 py-1 bg-amber-400 hover:bg-amber-300 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Add Smart AI Bot"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add AI Bot</span>
                </button>
              )}
            </div>

            {gameMode === 'room' && players.length === 1 && (
              <div className="mb-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
                <span className="font-bold block text-amber-300 mb-1">Waiting for other players to join!</span>
                Give your friend the room code <strong className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-white border border-amber-500/50">{roomId}</strong> or copy the invite link above. Need to start immediately? Click <strong>+ Add AI Bot</strong>!
              </div>
            )}

            <p className="text-xs text-slate-400 mb-3">
              Minimum 3 players required to start. Human players join with room code!
            </p>

            <div className="space-y-2">
              {players.map((p, index) => {
                const isSelf = p.id === myPlayerId;
                const canEditName = isSelf || gameMode === 'pass_and_play';

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border-2 transition-all ${
                      isSelf
                        ? 'border-emerald-500/50 bg-slate-800/90 shadow-xs'
                        : 'border-slate-700/80 bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{p.avatar}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {canEditName ? (
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => onUpdatePlayerName(p.id, e.target.value)}
                                className="font-bold text-xs sm:text-sm text-white bg-slate-900/70 border border-slate-600 hover:border-slate-500 focus:border-emerald-400 focus:outline-hidden rounded px-1.5 py-0.5"
                                maxLength={20}
                                title="Click to edit your name"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-xs sm:text-sm text-white px-1 truncate select-none">
                              {p.name}
                            </span>
                          )}

                          {p.isHost && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                              HOST
                            </span>
                          )}
                          {isSelf && !p.isHost && (
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block px-1">
                          {p.isHuman ? (isSelf ? 'You (Human)' : 'Human Player') : 'Smart AI Bot'}
                        </span>
                      </div>
                    </div>

                    {/* Remove button: Host can remove any player/bot, or user can remove bot */}
                    {(isHost || !p.isHuman) && players.length > 1 && !isSelf && (
                      <button
                        onClick={() => onRemovePlayer(p.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
                        title="Remove player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Category Selector & Start Action */}
        <div className="retro-card rounded-2xl p-5 bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-700">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" />
                <h2 className="font-display font-extrabold text-base sm:text-lg uppercase text-white">
                  Select Category Deck
                </h2>
              </div>

              <button
                onClick={onOpenOptions}
                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors cursor-pointer"
                title="All Settings & Rules"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Category Deck Selection: 2 Primary (Random, Select One) + Select Random (Custom Dropdown) */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setDeckMode('random');
                    onSelectCategory('random');
                    handleSettingChange({ categoryDeckMode: 'random' });
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deckMode === 'random'
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Random</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeckMode('select_one');
                    if (selectedCategoryId === 'random') {
                      onSelectCategory(CATEGORIES[0].id);
                    }
                    handleSettingChange({ categoryDeckMode: 'select_one' });
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deckMode === 'select_one'
                      ? 'bg-emerald-400 text-slate-950 shadow-xs ring-1 ring-emerald-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Select One</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeckMode('select_random');
                    handleSettingChange({ categoryDeckMode: 'select_random' });
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deckMode === 'select_random'
                      ? 'bg-cyan-400 text-slate-950 shadow-xs ring-1 ring-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Select Random</span>
                </button>
              </div>

              {/* VIEW 1: RANDOM */}
              {deckMode === 'random' && (
                <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                        <Shuffle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="font-display font-extrabold text-xs text-white uppercase">All Categories Random</div>
                        <div className="text-[10px] text-slate-400">Picks a surprise deck each round</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {CATEGORIES.length} Categories
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Each round randomly pulls from all {CATEGORIES.length} decks (400 secret words) including Fast Food, Superheroes, Fruits, Movies, Video Games, Animals, and more.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1 max-h-20 overflow-y-auto">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <span key={cat.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {cat.name}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                      +{CATEGORIES.length - 8} more...
                    </span>
                  </div>
                </div>
              )}

              {/* VIEW 2: SELECT ONE */}
              {deckMode === 'select_one' && (
                <div className="space-y-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-700">
                  <div>
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Choose Category Deck:</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">{CATEGORIES.length} available</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategoryId === 'random' ? CATEGORIES[0].id : selectedCategoryId}
                        onChange={(e) => onSelectCategory(e.target.value)}
                        className="w-full bg-slate-800 border-2 border-slate-600 focus:border-emerald-400 rounded-xl py-2 pl-3 pr-8 text-xs sm:text-sm font-display font-extrabold text-white uppercase appearance-none cursor-pointer outline-none transition-colors"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-slate-900 text-white py-1">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Selected Category Details */}
                  <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedCategoryObj.bannerColor}`} />
                        <span className="font-display font-extrabold text-xs text-white uppercase">
                          {selectedCategoryObj.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        16 Secret Words
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{selectedCategoryObj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {selectedCategoryObj.items.slice(0, 8).map((word) => (
                        <span key={word} className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700">
                          {word}
                        </span>
                      ))}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-700">
                        +8 more words
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: SELECT RANDOM (CUSTOM POOL DROPDOWN) */}
              {deckMode === 'select_random' && (
                <div className="space-y-2.5 bg-slate-900/80 rounded-xl p-3.5 border border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
                      Custom Random Pool:
                    </span>
                    <span className="font-mono text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {activePool.length} of {CATEGORIES.length} Selected
                    </span>
                  </div>

                  {/* Dropdown Toggle Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPoolDropdownOpen(!isPoolDropdownOpen)}
                      className="w-full bg-slate-800 hover:bg-slate-750 border-2 border-slate-600 hover:border-cyan-400 rounded-xl py-2 px-3 flex items-center justify-between text-xs font-display font-extrabold text-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">📋</span>
                        <span>Select Categories Dropdown</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                        <span>{activePool.length} selected</span>
                        {isPoolDropdownOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </button>

                    {/* Dropdown Menu Panel */}
                    {isPoolDropdownOpen && (
                      <div className="mt-2 p-2.5 bg-slate-900 border-2 border-slate-600 rounded-xl shadow-2xl space-y-2">
                        {/* Search & Bulk Select Controls */}
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={poolSearchQuery}
                              onChange={(e) => setPoolSearchQuery(e.target.value)}
                              placeholder="Search categories..."
                              className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-400 rounded-lg pl-8 pr-2 py-1 text-xs text-white placeholder:text-slate-500 outline-none"
                            />
                            {poolSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setPoolSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleSelectAllPool}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-emerald-400 border border-slate-700 cursor-pointer"
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllPool}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-rose-400 border border-slate-700 cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>

                        {/* Scrollable Checkbox Checklist */}
                        <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                          {filteredCategoriesForPool.length === 0 ? (
                            <div className="text-center py-4 text-xs text-slate-500 font-mono">
                              No categories match "{poolSearchQuery}"
                            </div>
                          ) : (
                            filteredCategoriesForPool.map((cat) => {
                              const isChecked = activePool.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => handleToggleCategoryInPool(cat.id)}
                                  className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                                    isChecked
                                      ? 'bg-cyan-950/50 border-cyan-800/80 text-white'
                                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                                        isChecked ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${cat.bannerColor}`} />
                                    <span className="font-display font-bold text-[11px] truncate">{cat.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">16 words</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Pool Chips / Notice */}
                  {activePool.length === 0 ? (
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 text-center">
                      ⚠️ No categories selected! Please check at least one in the dropdown.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">
                        Included in random pool ({activePool.length}):
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                        {activePool.map((catId) => {
                          const cat = CATEGORIES.find((c) => c.id === catId);
                          if (!cat) return null;
                          return (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-slate-200"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cat.bannerColor}`} />
                              <span>{cat.name}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryInPool(cat.id)}
                                className="text-slate-400 hover:text-white ml-0.5 cursor-pointer"
                                title={`Remove ${cat.name}`}
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Start Game CTA */}
          <div className="pt-4 border-t-2 border-slate-700 space-y-2">
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="w-full retro-button py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 rounded-xl font-display font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{canStart ? 'Deal Cards & Start Round' : `Need at least 3 players (${players.length}/3)`}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <button
                onClick={onOpenRules}
                className="hover:underline flex items-center gap-1 text-slate-300 font-medium cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quick Rules</span>
              </button>
              <span className="font-mono text-slate-400">
                {settings.chameleonCount || 1} Chameleon • {settings.turnTimer ? `${settings.turnTimerSeconds || 60}s` : 'No Timer'} • Target: {settings.targetScore === 0 ? '∞ Infinite' : `${settings.targetScore || 5} pts`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Lobby Game Settings Panel */}
      <div className="retro-card rounded-2xl p-5 sm:p-6 bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-700 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide">
                Lobby Game Settings
              </h3>
              <p className="text-xs text-slate-400">
                Adjust the number of chameleons, turn timers, and points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isHost && gameMode === 'room' && (
              <span className="text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 px-2 py-1 rounded text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Configured by Host
              </span>
            )}
            <button
              onClick={onOpenOptions}
              className="text-xs font-mono font-bold text-slate-300 hover:text-white underline cursor-pointer"
            >
              All Options
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Setting 1: # of Chameleons */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border-2 border-slate-700/80 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  Chameleons
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">
                  {settings.chameleonCount || 1} {settings.chameleonCount === 2 ? 'Chameleons' : 'Chameleon'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                2 chameleons is recommended for 5+ players.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2].map((count) => {
                const isSelected = (settings.chameleonCount || 1) === count;
                return (
                  <button
                    key={count}
                    type="button"
                    disabled={!isHost && gameMode === 'room'}
                    onClick={() => handleSettingChange({ chameleonCount: count })}
                    className={`py-1.5 px-2 rounded-lg font-mono font-extrabold text-xs uppercase tracking-wider text-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    } ${!isHost && gameMode === 'room' ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                  >
                    {count === 1 ? '1 Chameleon' : '2 Chameleons'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 2: Times / Turn Timer */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border-2 border-slate-700/80 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Turn Timer
                </span>
                <button
                  type="button"
                  disabled={!isHost && gameMode === 'room'}
                  onClick={() => handleSettingChange({ turnTimer: !settings.turnTimer })}
                  className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded transition-all ${
                    settings.turnTimer
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  } ${!isHost && gameMode === 'room' ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                >
                  {settings.turnTimer ? 'ON' : 'OFF'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {settings.turnTimer ? 'Limit per clue and voting round:' : 'Timer is turned off.'}
              </p>
            </div>

            {settings.turnTimer ? (
              <div className="grid grid-cols-5 gap-1">
                {timerDurations.map((sec) => {
                  const isSelected = (settings.turnTimerSeconds || 60) === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      disabled={!isHost && gameMode === 'room'}
                      onClick={() => handleSettingChange({ turnTimerSeconds: sec })}
                      className={`py-1 px-1 rounded font-mono font-extrabold text-[11px] uppercase tracking-wider text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 font-black ring-1 ring-cyan-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      } ${!isHost && gameMode === 'room' ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                    >
                      {sec}s
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-500 italic text-center py-1">
                Relaxed un-timed play
              </div>
            )}
          </div>

          {/* Setting 3: Points / Scoring */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border-2 border-slate-700/80 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Target Points
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">
                  {settings.targetScore === 0 ? '∞ Infinite' : `${settings.targetScore || 5} pts to win`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                First player to hit score wins match:
              </p>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {targetScores.map((score) => {
                const isSelected = (settings.targetScore ?? 5) === score;
                return (
                  <button
                    key={score}
                    type="button"
                    disabled={!isHost && gameMode === 'room'}
                    onClick={() => handleSettingChange({ targetScore: score })}
                    className={`py-1 px-1 rounded font-mono font-extrabold text-[11px] uppercase tracking-wider text-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black ring-1 ring-amber-300'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    } ${!isHost && gameMode === 'room' ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                  >
                    {score === 0 ? '∞ Infn' : `${score} pts`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Points Breakdown Row */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Innocents Catch:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-emerald-400 mr-1">
                +{settings.innocentCatchPoints || 2} pts
              </span>
              {isHost && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSettingChange({ innocentCatchPoints: val })}
                      className={`w-4 h-4 rounded text-[9px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                        (settings.innocentCatchPoints || 2) === val
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Chameleon Escapes:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-purple-400 mr-1">
                +{settings.chameleonEscapePoints || 2} pts
              </span>
              {isHost && (
                <div className="flex gap-0.5">
                  {[2, 3, 4].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSettingChange({ chameleonEscapePoints: val })}
                      className={`w-4 h-4 rounded text-[9px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                        (settings.chameleonEscapePoints || 2) === val
                          ? 'bg-purple-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Caught Word Steal:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-amber-400 mr-1">
                +{settings.chameleonStealPoints || 1} pts
              </span>
              {isHost && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSettingChange({ chameleonStealPoints: val })}
                      className={`w-4 h-4 rounded text-[9px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                        (settings.chameleonStealPoints || 1) === val
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
