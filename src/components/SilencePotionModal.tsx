import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VolumeX, X, AlertTriangle, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { Player } from '../types';

interface SilencePotionModalProps {
  isOpen: boolean;
  players: Player[];
  activePlayerId: string;
  onConfirmSilence: (targetPlayerId: string) => void;
  onClose: () => void;
}

export const SilencePotionModal: React.FC<SilencePotionModalProps> = ({
  isOpen,
  players,
  activePlayerId,
  onConfirmSilence,
  onClose,
}) => {
  // Targetable candidates: all players except the active Chameleon
  const candidatePlayers = players.filter((p) => p.id !== activePlayerId);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(candidatePlayers[0]?.id || '');

  useEffect(() => {
    if (isOpen) {
      const defaultTarget = candidatePlayers[0]?.id || '';
      setSelectedTargetId(defaultTarget);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetPlayer = candidatePlayers.find((p) => p.id === selectedTargetId);

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    onConfirmSilence(selectedTargetId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-[#111726] border-2 border-rose-500/80 rounded-2xl shadow-2xl shadow-rose-950/70 text-slate-100 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 p-4 sm:p-5 border-b-2 border-rose-500/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl select-none">🤐</span>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <span>ELIXIR OF SILENCE</span>
                  <span className="text-[10px] font-mono font-bold bg-rose-900/90 text-rose-200 border border-rose-400 px-2 py-0.5 rounded">
                    Chameleon Mute
                  </span>
                </h3>
                <p className="text-xs text-rose-200/80 font-mono">
                  Silence a player from talking during discussion
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Rule Callout */}
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
              <VolumeX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-bold mb-0.5">
                  How the Mute Curse Works:
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  The chosen player will be <strong>forbidden from speaking or typing</strong> in the discussion & debate!
                  Their clue will <strong>still show</strong> normally on the board, but they cannot defend themselves or expose your identity!
                </p>
              </div>
            </div>

            {/* Step: Select Target Player */}
            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-300 mb-2">
                Select Player to Mute:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {candidatePlayers.map((p) => {
                  const isSelected = p.id === selectedTargetId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedTargetId(p.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/80 border-rose-400 text-white shadow-md ring-1 ring-rose-400'
                          : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl shrink-0">{p.avatar}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white truncate">
                              {p.name}
                            </span>
                            {!p.isHuman && (
                              <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1 py-0.2 rounded">
                                BOT
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-amber-300 truncate block mt-0.5">
                            {p.clue ? `Clue: "${p.clue}"` : 'Clue pending...'}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Preview */}
            {targetPlayer && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Selected Target:</span>
                  <span className="font-mono text-rose-300 font-bold">Will be Muted 🤐</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="text-xl">{targetPlayer.avatar}</span>
                  <span className="text-sm">{targetPlayer.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-700/50 px-2 py-0.5 rounded">
                    Clue stays visible: "{targetPlayer.clue || 'Clue'}"
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-900/90 border-t-2 border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-display font-black uppercase tracking-wider text-xs cursor-pointer transition-colors border border-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedTargetId}
              onClick={handleConfirm}
              className="retro-button px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-xl font-display font-black text-white uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer border border-rose-400"
            >
              <VolumeX className="w-4 h-4" />
              <span>Mute {targetPlayer?.name || 'Player'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
