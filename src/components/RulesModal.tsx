import React from 'react';
import { X, BookOpen, AlertTriangle, Trophy, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="retro-card rounded-2xl w-full max-w-xl bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-6 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 border border-slate-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase">
                How to Play The Infiltrator
              </h3>
              <p className="text-xs text-slate-400">The social deduction word game of blending in, deceptive clues, and secret codes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          {/* Step 1 */}
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h4 className="font-display font-bold text-white uppercase flex items-center gap-1.5 mb-1 text-xs">
              <span className="w-5 h-5 bg-amber-400 text-slate-950 font-black rounded flex items-center justify-center text-[11px]">
                1
              </span>
              The Secret Coordinate & The Infiltrator
            </h4>
            <p>
              Each round, a 16-word topic card (4x4 matrix) is revealed. A secret coordinate is determined (e.g. <strong>Row 2, Column C → Queen</strong>).
              All innocent players see the coordinate. <strong>One player is secretly The Infiltrator</strong> and only sees the card words—not the coordinate!
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h4 className="font-display font-bold text-white uppercase flex items-center gap-1.5 mb-1 text-xs">
              <span className="w-5 h-5 bg-cyan-400 text-slate-950 font-black rounded flex items-center justify-center text-[11px]">
                2
              </span>
              Submitting Clues
            </h4>
            <p>
              Every player takes a turn submitting <strong>a clue (up to 80 characters)</strong> related to the secret topic.
              Innocents want to prove they know the word without making it too obvious. The Infiltrator must blend in by using clues from earlier players or ambiguous hints!
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h4 className="font-display font-bold text-white uppercase flex items-center gap-1.5 mb-1 text-xs">
              <span className="w-5 h-5 bg-rose-400 text-slate-950 font-black rounded flex items-center justify-center text-[11px]">
                3
              </span>
              The Accusation Vote
            </h4>
            <p>
              Once all clues are on the table, players debate and vote on who they believe is The Infiltrator.
            </p>
          </div>

          {/* Step 4: Resolution & Scoring */}
          <div className="p-3 bg-slate-800/80 rounded-lg border border-emerald-500/40">
            <h4 className="font-display font-bold text-emerald-400 uppercase flex items-center gap-1.5 mb-1 text-xs">
              <Trophy className="w-4 h-4 text-emerald-400" />
              Scoring & Infiltrator Escape
            </h4>
            <ul className="space-y-1.5 mt-1 list-disc pl-4 text-slate-300">
              <li>
                <strong className="text-white">Innocents Win (+2 pts each):</strong> The Infiltrator is caught by majority vote, and guesses the wrong word.
              </li>
              <li>
                <strong className="text-white">Infiltrator Steals Win (+2 pts to Infiltrator):</strong> The Infiltrator is caught, but in their Last Stand they inspect all player hints and correctly deduce and select the secret word from the 16-tile matrix!
              </li>
              <li>
                <strong className="text-white">Infiltrator Escapes Undetected (+3 pts to Infiltrator):</strong> An innocent player is mistakenly voted out!
              </li>
              <li>
                <strong className="text-white">Bonus Point (+1 pt):</strong> If enabled in settings, every innocent who voted for the true Infiltrator gets +1 point.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="retro-button px-5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
