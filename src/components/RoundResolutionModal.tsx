import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, ArrowRight, Eye, RefreshCw, X, ShieldAlert, CheckCircle2, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player, RoundResolution } from '../types';
import { sound } from '../utils/sound';

interface RoundResolutionModalProps {
  isOpen: boolean;
  roundResolution: RoundResolution | null;
  players: Player[];
  onNextRound: () => void;
  onClose?: () => void;
  roundNumber?: number;
  targetScore?: number;
  isHost?: boolean;
  gameMode?: string;
}

export const RoundResolutionModal: React.FC<RoundResolutionModalProps> = ({
  isOpen,
  roundResolution,
  players,
  onNextRound,
  onClose,
  roundNumber,
  targetScore = 5,
  isHost = true,
  gameMode = 'solo',
}) => {
  if (!roundResolution) return null;

  const isInnocentWin = roundResolution.winner === 'innocents';
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Trigger celebration confetti, particle animation, & fanfare audio based on winner
  useEffect(() => {
    if (!isOpen || !roundResolution) {
      confetti.reset();
      return;
    }

    if (isInnocentWin) {
      // Audio Fanfare
      sound.celebrateInnocents();

      // --- INNOCENTS CELEBRATION (Emerald, Gold, Cyan, Silver) ---
      confetti({
        particleCount: 65,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#38bdf8', '#ffffff'],
        disableForReducedMotion: true,
      });

      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.08, y: 0.72 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#38bdf8'],
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.92, y: 0.72 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#38bdf8'],
          disableForReducedMotion: true,
        });
      }, 250);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 120,
          origin: { y: 0.38 },
          colors: ['#34d399', '#fbbf24', '#ffffff', '#10b981', '#67e8f9'],
          shapes: ['circle', 'square'],
          disableForReducedMotion: true,
        });
      }, 550);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        confetti.reset();
      };
    } else {
      // Audio Stealth Victory
      sound.celebrateInfiltrator();

      // --- INFILTRATOR CELEBRATION (Crimson, Violet, Amber, Neon Rose) ---
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#fbbf24', '#dc2626'],
        disableForReducedMotion: true,
      });

      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 50,
          spread: 70,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#dc2626', '#f43f5e'],
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 50,
          angle: 130,
          spread: 70,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#dc2626', '#f43f5e'],
          disableForReducedMotion: true,
        });
      }, 250);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 110,
          origin: { y: 0.38 },
          colors: ['#a855f7', '#fbbf24', '#f43f5e', '#ef4444', '#e11d48', '#7c3aed'],
          shapes: ['circle', 'square'],
          disableForReducedMotion: true,
        });
      }, 550);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        confetti.reset();
      };
    }
  }, [isOpen, roundResolution, isInnocentWin]);

  // Ambient floating background particles configuration (Emerald/Gold vs Crimson/Purple)
  const ambientParticles = React.useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: (i * 15 + 6) % 94,
      y: (i * 21 + 9) % 88,
      size: (i % 3) + 3,
      duration: 3.5 + (i % 4) * 1.2,
      delay: (i % 6) * 0.35,
    }));
  }, []);

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
            {/* Ambient Animated Victory Sparks & Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {ambientParticles.map((pt) => {
                const isSpecial = pt.id % 4 === 0;
                return (
                  <motion.div
                    key={pt.id}
                    className={`absolute flex items-center justify-center ${
                      isInnocentWin
                        ? pt.id % 2 === 0
                          ? 'text-emerald-400 drop-shadow-[0_0_8px_#34d399]'
                          : 'text-amber-300 drop-shadow-[0_0_8px_#fcd34d]'
                        : pt.id % 2 === 0
                        ? 'text-rose-500 drop-shadow-[0_0_8px_#f43f5e]'
                        : 'text-purple-400 drop-shadow-[0_0_8px_#c084fc]'
                    }`}
                    style={{
                      left: `${pt.x}%`,
                      top: `${pt.y}%`,
                      width: `${pt.size * (isSpecial ? 2.6 : 1)}px`,
                      height: `${pt.size * (isSpecial ? 2.6 : 1)}px`,
                    }}
                    animate={{
                      y: [0, -50, -110],
                      x: [0, (pt.id % 2 === 0 ? 1 : -1) * 16, 0],
                      opacity: [0, 0.85, 0],
                      scale: [0.6, 1.3, 0.3],
                      rotate: isSpecial ? [0, 180, 360] : 0,
                    }}
                    transition={{
                      duration: pt.duration,
                      repeat: Infinity,
                      delay: pt.delay,
                      ease: 'easeInOut',
                    }}
                  >
                    {isSpecial ? (
                      isInnocentWin ? (
                        <Sparkles className="w-full h-full" />
                      ) : (
                        <Flame className="w-full h-full" />
                      )
                    ) : (
                      <div
                        className={`w-full h-full rounded-full ${
                          isInnocentWin
                            ? pt.id % 2 === 0
                              ? 'bg-emerald-400'
                              : 'bg-amber-300'
                            : pt.id % 2 === 0
                            ? 'bg-rose-500'
                            : 'bg-purple-400'
                        }`}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

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
            <div className="relative z-1 text-center pt-1 pb-3 border-b border-slate-700/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest mb-2 border shadow-xs">
                {isInnocentWin ? (
                  <div className="flex items-center gap-1.5 text-emerald-300 border-emerald-500/40 bg-emerald-950/80">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Innocents Win Round {roundNumber || ''}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-300 border-amber-500/40 bg-amber-950/80">
                    <span>🕵️</span>
                    <span>The Infiltrator Wins Round {roundNumber || ''}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                <span>{isInnocentWin ? '🏆' : '🕵️'}</span>
                <span>{isInnocentWin ? 'INNOCENTS VICTORIOUS!' : 'INFILTRATOR ESCAPED!'}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1 font-medium">
                {roundResolution.reason === 'innocents_caught_fox' &&
                  'The room correctly sniffed out The Infiltrator, and the impostor could not guess the secret word!'}
                {roundResolution.reason === 'fox_stole_win' &&
                  'The Infiltrator was voted out, but miraculously deduced the secret word to steal the round!'}
                {roundResolution.reason === 'fox_escaped_undetected' &&
                  'The Infiltrator successfully blended in unnoticed while someone else took the blame!'}
              </p>
            </div>

            {/* Secret Word & Infiltrator Reveal Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/85 border border-slate-700/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  The Infiltrator
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">🕵️</span>
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

            {/* Infiltrator Guess info (if applicable) */}
            {roundResolution.foxGuessWord && (
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Infiltrator's Escape Guess:</span>
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

            {/* Gold Reward & Shop Alert with Live Countdown */}
            {roundResolution.isMatchComplete && roundResolution.accolades && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(roundResolution.accolades as Record<string, string[]>).flatMap(([playerId, badges]) => {
                  const player = players.find((p) => p.id === playerId);
                  return (badges || []).map((badge) => (
                    <div key={`${playerId}-${badge}`} className="p-3 rounded-xl bg-gradient-to-br from-amber-950/90 via-purple-950/80 to-slate-900 border border-amber-400/80 shadow-[0_0_18px_rgba(251,191,36,0.35)]">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">Match Accolade</div>
                      <div className="font-display font-black text-white mt-1">{badge}</div>
                      <div className="text-[11px] text-slate-300 mt-1 truncate">{player?.name}</div>
                    </div>
                  ));
                })}
              </div>
            )}

            {(() => {
              const isShopRound = Boolean(roundNumber && roundNumber % 3 === 0);
              const roundsUntilShop = roundNumber ? 3 - (roundNumber % 3 === 0 ? 3 : roundNumber % 3) : 3;

              return (
                <div
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs transition-all ${
                    isShopRound
                      ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-400/90 text-amber-100 shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40'
                      : 'bg-slate-900/80 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">🪙</span>
                    <span className="font-mono text-xs">
                      Round Reward: <strong className="text-amber-400 font-bold">+100 Gold Coins</strong> awarded to all players!
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isShopRound ? (
                      <span className="font-mono text-xs font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-lg border border-amber-300 animate-pulse flex items-center gap-1.5 shadow-sm">
                        <span>🛒</span>
                        <span>Mystic Shop Open Next!</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/60 flex items-center gap-1.5">
                        <span>🛒</span>
                        <span>
                          Shop in {roundsUntilShop} round{roundsUntilShop > 1 ? 's' : ''} (after Round {roundNumber + roundsUntilShop})
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

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

              {gameMode === 'room' && !isHost ? (
                <div className="w-full flex-1 py-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700 text-center flex items-center justify-center gap-2.5 text-slate-300 font-display text-xs sm:text-sm font-bold shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="text-amber-300">
                    {roundNumber && roundNumber % 3 === 0
                      ? 'Waiting for Host to proceed to Shop 🛒...'
                      : 'Waiting for Host to start the next round...'}
                  </span>
                </div>
              ) : roundNumber && roundNumber % 3 === 0 ? (
                <button
                  onClick={onNextRound}
                  className="w-full flex-1 retro-button px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer transition-transform border-2 border-amber-300 active:scale-95 animate-pulse"
                >
                  <span className="text-base">🛒</span>
                  <span>Proceed to Shop</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              ) : (
                <button
                  onClick={onNextRound}
                  className="w-full flex-1 retro-button px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <span>Proceed to Next Round</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
