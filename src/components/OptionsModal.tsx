import React from 'react';
import { X, Check, Settings, ShieldCheck, Clock, Eye, Sparkles, Trophy, Users, FlaskConical } from 'lucide-react';
import { GameSettings } from '../types';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof GameSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  const timerDurations = [30, 45, 60, 90, 120];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="retro-card rounded-2xl w-full max-w-lg bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-700 sticky top-0 bg-[#131B2E] z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 border border-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase">
                Game & Lobby Settings
              </h3>
              <p className="text-xs text-slate-400">Configure infiltrators, round timer, and scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3.5">
          {/* 1. Number of Infiltrators */}
          <div className="p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Number of Infiltrators</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {settings.chameleonCount || 1} Infiltrator{(settings.chameleonCount || 1) > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Select how many players are secret Infiltrators (2 recommended for 5+ players).
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map((count) => {
                const isSelected = (settings.chameleonCount || 1) === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onUpdateSettings({ chameleonCount: count })}
                    className={`py-1.5 px-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                        : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    {count === 1 ? '1 Infiltrator (Classic)' : '2 Infiltrators (Double Trouble)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Turn Timer & Times */}
          <div className="p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Turn Timer Limit</span>
              </div>
              <button
                type="button"
                onClick={() => toggle('turnTimer')}
                className={`retro-button px-2.5 py-0.5 rounded text-xs font-mono font-black uppercase tracking-wider cursor-pointer ${
                  settings.turnTimer
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                    : 'bg-slate-700 text-slate-400 border-slate-600'
                }`}
              >
                {settings.turnTimer ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {settings.turnTimer
                ? `Active: ${settings.turnTimerSeconds || 60} seconds per clue and deliberation.`
                : 'Timer disabled. Players take turns at a relaxed pace.'}
            </p>
            {settings.turnTimer && (
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {timerDurations.map((sec) => {
                  const isSelected = (settings.turnTimerSeconds || 60) === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateSettings({ turnTimerSeconds: sec })}
                      className={`py-1 px-2 rounded font-mono font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 font-black ring-1 ring-cyan-300'
                          : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 border border-slate-600'
                      }`}
                    >
                      {sec}s
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Scoring & Points */}
          <div className="p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Points & Match Target</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                First to {settings.targetScore || 5} pts
              </span>
            </div>

            {/* Custom Input for Target Score */}
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1.5">
                Custom Points to Win Match:
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={settings.targetScore || 5}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onUpdateSettings({ targetScore: isNaN(val) || val < 1 ? 1 : val });
                    }}
                    className="w-full bg-slate-900 border-2 border-slate-600 focus:border-amber-400 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-amber-300 outline-none transition-colors"
                    placeholder="Enter points to win..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                    points
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ targetScore: Math.max(1, (settings.targetScore || 5) - 1) })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-mono font-bold flex items-center justify-center cursor-pointer transition-colors"
                  title="Decrease points"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ targetScore: (settings.targetScore || 5) + 1 })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-mono font-bold flex items-center justify-center cursor-pointer transition-colors"
                  title="Increase points"
                >
                  +
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-mono">Presets:</span>
                {[3, 5, 8, 10, 15, 20].map((score) => {
                  const isSelected = settings.targetScore === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => onUpdateSettings({ targetScore: score })}
                      className={`py-0.5 px-2 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Points breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Innocents Catch</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    +{settings.innocentCatchPoints || 2} pts
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdateSettings({ innocentCatchPoints: val })}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                          (settings.innocentCatchPoints || 2) === val
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Infiltrator Escapes</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-purple-300">
                    +{settings.infiltratorEscapePoints ?? settings.chameleonEscapePoints ?? 2} pts
                  </span>
                  <div className="flex gap-1">
                    {[2, 3, 4].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdateSettings({ infiltratorEscapePoints: val, chameleonEscapePoints: val })}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                          (settings.infiltratorEscapePoints ?? settings.chameleonEscapePoints ?? 2) === val
                            ? 'bg-purple-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Caught Word Steal</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    +{settings.infiltratorStealPoints ?? settings.chameleonStealPoints ?? 1} pt{(settings.infiltratorStealPoints ?? settings.chameleonStealPoints ?? 1) > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdateSettings({ infiltratorStealPoints: val, chameleonStealPoints: val })}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                          (settings.infiltratorStealPoints ?? settings.chameleonStealPoints ?? 1) === val
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 1 point for guessing infiltrator: [YES/NO] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>+1 Bonus Point for voting Infiltrator</span>
              </div>
              <p className="text-xs text-slate-400">
                Bonus point awarded to each individual player who correctly voted for The Infiltrator.
              </p>
            </div>
            <button
              onClick={() => toggle('pointForGuessingFox')}
              className={`retro-button px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider cursor-pointer ${
                settings.pointForGuessingFox
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}
            >
              {settings.pointForGuessingFox ? 'YES' : 'NO'}
            </button>
          </div>

          {/* 5. Infiltrator can see one random player's clue early: [YES/NO] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Infiltrator sees 1 player clue early</span>
              </div>
              <p className="text-xs text-slate-400">
                Gives The Infiltrator a fighting chance by letting them secretly view one innocent clue before submitting.
              </p>
            </div>
            <button
              onClick={() => toggle('foxSeeOneClueEarly')}
              className={`retro-button px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider cursor-pointer ${
                settings.foxSeeOneClueEarly
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}
            >
              {settings.foxSeeOneClueEarly ? 'YES' : 'NO'}
            </button>
          </div>

          {/* 6. Anonymous Voting: [YES/NO] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Anonymous Voting</span>
              </div>
              <p className="text-xs text-slate-400">
                Hide who voted for whom until everyone has locked in their vote to prevent bandwagons.
              </p>
            </div>
            <button
              onClick={() => toggle('anonymousVoting')}
              className={`retro-button px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider cursor-pointer ${
                settings.anonymousVoting
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}
            >
              {settings.anonymousVoting ? 'YES' : 'NO'}
            </button>
          </div>

          {/* 7. In-Game Items & Potion Shop: [ENABLED/DISABLED] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>In-Game Items & Potion Shop</span>
              </div>
              <p className="text-xs text-slate-400">
                Enable tactical potions (Oracle Glass, Vote Shield, Elixir of Silence, etc.) and the shop phase every 3 rounds.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ itemsEnabled: settings.itemsEnabled === false ? true : false })}
              className={`retro-button px-3 py-1 rounded text-xs font-mono font-black uppercase tracking-wider cursor-pointer ${
                settings.itemsEnabled !== false
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}
            >
              {settings.itemsEnabled !== false ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5 pt-3 border-t border-slate-700 flex justify-end sticky bottom-0 bg-[#131B2E] z-10">
          <button
            onClick={onClose}
            className="retro-button px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-lg cursor-pointer shadow-md"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};

