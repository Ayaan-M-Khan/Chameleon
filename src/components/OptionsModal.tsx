import React from 'react';
import { X, Check, Settings, ShieldCheck, Clock, Eye, Sparkles, Trophy, Users } from 'lucide-react';
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
  const targetScores = [5, 8, 10, 15, 0];

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
              <p className="text-xs text-slate-400">Configure chameleons, round timer, and scoring</p>
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
          {/* 1. Number of Chameleons */}
          <div className="p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Number of Chameleons</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {settings.chameleonCount || 1} Chameleon{(settings.chameleonCount || 1) > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Select how many players are secret Chameleons (2 recommended for 5+ players).
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
                    {count === 1 ? '1 Chameleon (Classic)' : '2 Chameleons (Double Trouble)'}
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
                {settings.targetScore === 0 ? 'Match Target: ∞ Infinite' : `First to ${settings.targetScore || 5} pts`}
              </span>
            </div>

            {/* Target Score Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Score to Win Match:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {targetScores.map((score) => {
                  const isSelected = (settings.targetScore ?? 5) === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => onUpdateSettings({ targetScore: score })}
                      className={`py-1 px-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-black ring-1 ring-amber-300'
                          : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 border border-slate-600'
                      }`}
                    >
                      {score === 0 ? '∞ Infn' : `${score} pts`}
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
                <span className="text-[10px] text-slate-400 block">Chameleon Escapes</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-purple-300">
                    +{settings.chameleonEscapePoints || 2} pts
                  </span>
                  <div className="flex gap-1">
                    {[2, 3, 4].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdateSettings({ chameleonEscapePoints: val })}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                          (settings.chameleonEscapePoints || 2) === val
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
                    +{settings.chameleonStealPoints || 1} pt{(settings.chameleonStealPoints || 1) > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onUpdateSettings({ chameleonStealPoints: val })}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer ${
                          (settings.chameleonStealPoints || 1) === val
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

          {/* 4. 1 point for guessing chameleon: [YES/NO] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>+1 Bonus Point for voting Chameleon</span>
              </div>
              <p className="text-xs text-slate-400">
                Bonus point awarded to each individual player who correctly voted for the Chameleon.
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

          {/* 5. Chameleon can see one random player's clue early: [YES/NO] */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-700 bg-slate-800/80 hover:border-slate-600 transition-all">
            <div className="pr-4">
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Chameleon sees 1 player clue early</span>
              </div>
              <p className="text-xs text-slate-400">
                Gives the Chameleon a fighting chance by letting them secretly view one innocent clue before submitting.
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

