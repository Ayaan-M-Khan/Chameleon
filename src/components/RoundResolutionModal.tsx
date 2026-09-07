import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, ArrowRight, Eye, RefreshCw, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Player, RoundResolution } from '../types';

interface RoundResolutionModalProps {
  isOpen: boolean;
  roundResolution: RoundResolution | null;
  players: Player[];
  onNextRound: () => void;
  onClose?: () => void;
  roundNumber?: number;
  targetScore?: number;
}

export const RoundResolutionModal: React.FC<RoundResolutionModalProps> = ({
  isOpen,
  roundResolution,
  players,
  onNextRound,
  onClose,
  roundNumber,
  targetScore = 5,
}) => {
  if (!roundResolution) return null;

  const isInnocentWin = roundResolution.winner === 'innocents';
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with fade entry/exit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
          />

          {/* Modal Content with slide up and scale entry/exit */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 340,
            }}
            className="relative z-10 retro-card rounded-2xl w-full max-w-xl bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-5 sm:p-7 shadow-2xl space-y-4 my-auto overflow-hidden"
          >
            {/* Top Close / Inspect Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Dismiss to inspect board"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Victory Badge & Header */}
            <div className="text-center pt-1 pb-3 border-b border-slate-700/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest mb-2 border shadow-xs">
                {isInnocentWin ? (
                  <div className="flex items-center gap-1.5 text-emerald-300 border-emerald-500/40 bg-emerald-950/80">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Innocents Win Round {roundNumber || ''}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-300 border-amber-500/40 bg-amber-950/80">
                    <span>🦎</span>
                    <span>Chameleon Wins Round {roundNumber || ''}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                <span>{isInnocentWin ? '🏆' : '🦊'}</span>
                <span>{isInnocentWin ? 'INNOCENTS VICTORIOUS!' : 'CHAMELEON ESCAPED!'}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1 font-medium">
                {roundResolution.reason === 'innocents_caught_fox' &&
                  'The room correctly sniffed out the Chameleon, and the impostor could not guess the secret word!'}
                {roundResolution.reason === 'fox_stole_win' &&
                  'The Chameleon was voted out, but miraculously deduced the secret word to steal the round!'}
                {roundResolution.reason === 'fox_escaped_undetected' &&
                  'The Chameleon successfully blended in unnoticed while someone else took the blame!'}
              </p>
            </div>

            {/* Secret Word & Chameleon Reveal Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/85 border border-slate-700/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  The Chameleon
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">🦎</span>
                  <span className="font-display font-black text-amber-300 text-sm sm:text-base">
                    {roundResolution.foxPlayerName}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/85 border border-slate-700/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  Secret Word & Tile
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-black text-emerald-300 text-sm sm:text-base truncate">
                    {roundResolution.targetWord}
                  </span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-emerald-950/90 text-emerald-300 border border-emerald-700 rounded">
                    {roundResolution.targetCoordinate}
                  </span>
                </div>
              </div>
            </div>

            {/* Chameleon Guess info (if applicable) */}
            {roundResolution.foxGuessWord && (
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Chameleon's Escape Guess:</span>
                <span className="font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {roundResolution.foxGuessWord}
                </span>
              </div>
            )}

            {/* Round Points Earned */}
            <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-700/70">
              <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-300 block mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Round Points Awarded</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(roundResolution.pointsAwarded).map(([pId, data]) => {
                  const info = data as { points: number; explanation: string };
                  const player = players.find((p) => p.id === pId);
                  if (!player) return null;

                  return (
                    <div
                      key={pId}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base select-none">{player.avatar || '👤'}</span>
                        <div className="min-w-0">
                          <span className="font-bold text-white truncate block">{player.name}</span>
                          <span className="text-[10px] text-slate-400 truncate block leading-tight">
                            {info.explanation}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-black text-emerald-400 shrink-0 ml-2 text-sm">
                        +{info.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standings Table Snapshot */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Current Leader:
                </span>
                {targetScore === 0 ? (
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                    ∞ Infinite Mode
                  </span>
                ) : sortedPlayers[0]?.score >= targetScore ? (
                  <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-900/80 px-1.5 py-0.5 rounded border border-amber-500 animate-pulse flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" /> Target {targetScore}pts Reached!
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    Target: {targetScore} pts
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{sortedPlayers[0]?.avatar}</span>
                <span className="font-bold text-white">{sortedPlayers[0]?.name}</span>
                <span className="font-mono font-black text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                  {sortedPlayers[0]?.score} pts
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inspect Board</span>
                </button>
              )}

              <button
                onClick={onNextRound}
                className="w-full flex-1 retro-button px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform"
              >
                <span>Proceed to Next Round</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
