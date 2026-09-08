import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, Rows, Columns, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface OracleSerumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChoice: (choice: 'row' | 'col') => void;
}

export const OracleSerumModal: React.FC<OracleSerumModalProps> = ({
  isOpen,
  onClose,
  onSelectChoice,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="relative z-10 retro-card rounded-2xl w-full max-w-md bg-[#131B2E] border-2 border-purple-500/80 text-slate-100 p-6 shadow-2xl space-y-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5 pt-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-950 border-2 border-purple-400 text-2xl shadow-lg shadow-purple-500/20">
                🧪
              </div>
              <h3 className="text-xl font-display font-black text-purple-200 uppercase tracking-tight">
                Oracle Serum
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Peer into the mystical matrix. Reveal either the secret Row or Column to narrow down your disguise!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  sound.potionDrink();
                  onSelectChoice('row');
                }}
                className="retro-button p-3.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border-2 border-purple-500 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <Rows className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-600">
                    Row 1-4
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-white">
                    Reveal Secret Row
                  </h4>
                  <p className="text-[11px] text-purple-200/80 mt-0.5">
                    Highlights the horizontal line (1, 2, 3, or 4).
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.potionDrink();
                  onSelectChoice('col');
                }}
                className="retro-button p-3.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border-2 border-purple-500 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <Columns className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-600">
                    Col A-D
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-white">
                    Reveal Secret Column
                  </h4>
                  <p className="text-[11px] text-purple-200/80 mt-0.5">
                    Highlights the vertical line (A, B, C, or D).
                  </p>
                </div>
              </button>
            </div>

            <div className="text-center pt-2 text-[11px] font-mono text-slate-400">
              ⚡ Cap: 1 Oracle Serum per round
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
