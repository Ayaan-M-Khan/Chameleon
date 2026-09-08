import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { Category, Coordinate, Player } from '../types';

interface InfiltratorGuessModalProps {
  isOpen: boolean;
  category: Category;
  foxPlayerName: string;
  isHumanFox: boolean;
  players: Player[];
  onSelectGuess: (word: string, coordLabel: string) => void;
  selectedGuessWord: string | null;
  onSubmitGuess: () => void;
}

export const InfiltratorGuessModal: React.FC<InfiltratorGuessModalProps> = ({
  isOpen,
  category,
  foxPlayerName,
  isHumanFox,
  players,
  onSelectGuess,
  selectedGuessWord,
  onSubmitGuess,
}) => {
  const colHeaders: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const rowNumbers: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  const getItemAt = (rowIndex: number, colIndex: number) => {
    return category.items[rowIndex * 4 + colIndex] || '';
  };

  const playersWithClues = players.filter((p) => Boolean(p.clue));

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
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
          />

          {/* Modal Card with slide up & scale entry/exit */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 340,
            }}
            className="relative z-10 retro-card rounded-2xl w-full max-w-2xl bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-5 sm:p-6 shadow-2xl space-y-3.5 my-auto"
          >
            {/* Header */}
            <div className="text-center pb-3 border-b-2 border-slate-700">
              <div className="inline-flex items-center gap-1.5 bg-rose-950/80 text-rose-300 border border-rose-600 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>The Infiltrator Was Accused!</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
                The Infiltrator's Last Stand: Steal The Win
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
                {isHumanFox
                  ? 'You have one chance to escape! Review the hints given by all players below and guess the secret word (+2 pts)!'
                  : `${foxPlayerName} (The Infiltrator) is attempting to deduce the secret coordinate from everyone's hints...`}
              </p>
            </div>

            {/* Hints Given by Players Panel */}
            <div className="bg-slate-900/90 border-2 border-slate-700 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Hints Given By Other Players ({playersWithClues.length}):
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Analyze these clues to deduce the target word
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {playersWithClues.map((p) => {
                  const isFox = p.role === 'fox';
                  return (
                    <div
                      key={p.id}
                      className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${
                        isFox
                          ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                          : 'bg-slate-800 border-slate-700 text-slate-100 shadow-xs'
                      }`}
                    >
                      <span className="text-lg select-none shrink-0">{p.avatar || '👤'}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white text-[11px] truncate">{p.name}</span>
                          {isFox ? (
                            <span className="text-[9px] bg-rose-900 text-rose-300 font-bold px-1 rounded uppercase">
                              The Infiltrator (You)
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1 rounded font-semibold">
                              Hint
                            </span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-amber-300 break-words whitespace-normal text-xs sm:text-sm mt-0.5 leading-snug">
                          "{p.clue}"
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4x4 Grid Selector */}
            <div className="bg-slate-900/70 p-3 rounded-xl border-2 border-slate-700">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="font-mono text-[11px] font-bold text-slate-300 uppercase">
                  Topic: <strong className="text-white">{category.name}</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Click a word tile below to select your guess
                </span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[36px_repeat(4,1fr)] gap-1.5 mb-1.5 text-center font-mono font-bold text-xs">
                <div className="text-slate-500">#</div>
                {colHeaders.map((col) => (
                  <div key={col} className="bg-slate-800 py-1 rounded border border-slate-700 text-slate-200">
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {rowNumbers.map((rowNum, rIdx) => (
                  <div key={rowNum} className="grid grid-cols-[36px_repeat(4,1fr)] gap-1.5 items-stretch">
                    <div className="flex items-center justify-center bg-slate-800 font-mono font-bold text-xs rounded border border-slate-700 text-slate-200">
                      {rowNum}
                    </div>

                    {colHeaders.map((colChar, cIdx) => {
                      const item = getItemAt(rIdx, cIdx);
                      const coordLabel = `${colChar}${rowNum}`;
                      const isSelected = selectedGuessWord === item;

                      return (
                        <button
                          key={coordLabel}
                          disabled={!isHumanFox}
                          onClick={() => onSelectGuess(item, coordLabel)}
                          className={`p-2 rounded-lg border-2 text-left transition-all flex flex-col justify-between min-h-[52px] ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400 scale-[1.02] shadow-md font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                          } ${isHumanFox ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                            {coordLabel}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs font-semibold text-slate-300">
                {selectedGuessWord ? (
                  <span>
                    Selected Tile:{' '}
                    <strong className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded font-mono font-bold border border-slate-700">
                      {selectedGuessWord}
                    </strong>
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Click a tile above to make your selection</span>
                )}
              </div>

              {isHumanFox ? (
                <button
                  onClick={onSubmitGuess}
                  disabled={!selectedGuessWord}
                  className="w-full sm:w-auto retro-button px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Confirm Escape Word</span>
                </button>
              ) : (
                <div className="text-xs font-mono font-bold text-amber-400 animate-pulse">
                  AI Infiltrator is deliberating...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
