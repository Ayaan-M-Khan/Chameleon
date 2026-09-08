import React from 'react';
import { Eye, EyeOff, Sparkles, AlertTriangle, Crosshair } from 'lucide-react';
import { Category, Coordinate, PlayerRole, GamePhase } from '../types';

interface RightColumnGridProps {
  category: Category;
  role: PlayerRole;
  secretCoordinate: Coordinate | null;
  gamePhase: GamePhase;
  isFoxGuesser: boolean;
  onSelectWordGuess?: (word: string, coordLabel: string) => void;
  selectedGuessWord?: string | null;
  isPassAndPlay?: boolean;
  oracleHighlight?: { type: 'row' | 'col'; value: number | string } | null;
  isScrambling?: boolean;
}

export const RightColumnGrid: React.FC<RightColumnGridProps> = ({
  category,
  role,
  secretCoordinate,
  gamePhase,
  isFoxGuesser,
  onSelectWordGuess,
  selectedGuessWord,
  isPassAndPlay = false,
  oracleHighlight = null,
  isScrambling = false,
}) => {
  const [showRoleSecret, setShowRoleSecret] = React.useState(!isPassAndPlay);

  const colHeaders: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const rowNumbers: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  // Helper to get item at col and row
  // row 1..4 (index 0..3), col A..D (index 0..3)
  const getItemAt = (rowIndex: number, colIndex: number) => {
    const idx = rowIndex * 4 + colIndex;
    return category.items[idx] || '';
  };

  const isTargetCell = (rNum: number, cChar: string) => {
    return secretCoordinate?.row === rNum && secretCoordinate?.col === cChar;
  };

  const isFox = role === 'fox';

  return (
    <div className="retro-card rounded-xl p-4 flex flex-col h-full bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl">
      {/* Category Banner */}
      <div className="relative overflow-hidden rounded-lg border-2 border-slate-700 mb-3 text-white shadow-xs">
        <div className={`px-4 py-2.5 ${category.bannerColor} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-90 block">
              Official Category
            </span>
            <h2 className="text-lg sm:text-xl font-display font-extrabold tracking-wide uppercase">
              {category.name}
            </h2>
          </div>
          <div className="bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-mono font-bold text-white border border-white/10">
            16 Items • 4x4
          </div>
        </div>
      </div>

      {/* Role Banner */}
      <div className="mb-4">
        {isFox ? (
          <div className="rounded-lg border-2 border-rose-600 bg-rose-950/80 text-white p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🦎</span>
                <div>
                  <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-yellow-300">
                    You are the CHAMELEON! Blend in.
                  </h3>
                  <p className="text-xs text-rose-200 font-medium">
                    You do NOT know the secret coordinate. Listen to other players' clues, sound convincing, and avoid being voted out!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-emerald-600 bg-emerald-950/80 text-white p-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-2xl">🎯</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                      Secret Coordinate
                    </span>
                    {isPassAndPlay && (
                      <button
                        onClick={() => setShowRoleSecret(!showRoleSecret)}
                        className="text-[10px] flex items-center gap-0.5 bg-emerald-900 hover:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-100 transition-colors border border-emerald-700"
                      >
                        {showRoleSecret ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                        <span>{showRoleSecret ? 'Hide' : 'Peek'}</span>
                      </button>
                    )}
                  </div>

                  {showRoleSecret && secretCoordinate ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-base sm:text-lg font-black bg-emerald-900/90 text-yellow-300 px-2 py-0.5 rounded border border-emerald-500 shadow-xs">
                        {secretCoordinate.label}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white truncate">
                        → {secretCoordinate.item}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-200 italic">
                      Coordinate hidden (Click peek to view)
                    </span>
                  )}
                </div>
              </div>

              {showRoleSecret && (
                <div className="hidden sm:flex flex-col items-end text-[11px] text-emerald-200">
                  <span className="font-semibold">Role: Innocent</span>
                  <span className="text-emerald-400">Give 1 subtle clue</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fox Guess Callout (when in Fox Guess phase) */}
      {isFoxGuesser && (
        <div className="mb-3 p-2.5 bg-amber-950/80 border-2 border-amber-500 rounded-lg text-amber-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">
              The Chameleon was caught! Select the secret tile on the matrix to escape:
            </span>
          </div>
          {selectedGuessWord && (
            <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded border border-amber-500">
              Selected: {selectedGuessWord}
            </span>
          )}
        </div>
      )}

      {/* Active Potion Status Banner */}
      {oracleHighlight && (
        <div className="mb-3 p-2 bg-purple-950/80 border-2 border-purple-500/80 rounded-lg text-purple-200 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🧪</span>
            <span className="text-xs font-mono font-bold">
              Oracle Serum Active: Target is in{' '}
              <strong className="text-purple-300 underline font-black">
                {oracleHighlight.type === 'row' ? `Row ${oracleHighlight.value}` : `Column ${oracleHighlight.value}`}
              </strong>
            </span>
          </div>
          <span className="text-[10px] font-mono font-extrabold uppercase bg-purple-900 px-2 py-0.5 rounded border border-purple-400">
            Revealed
          </span>
        </div>
      )}

      {isScrambling && (
        <div className="mb-3 p-2 bg-cyan-950/80 border-2 border-cyan-400 rounded-lg text-cyan-200 flex items-center justify-between shadow-md animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-base select-none animate-spin">🌀</span>
            <span className="text-xs font-mono font-bold">
              Grid Scrambler Active: Matrix positions shifting!
            </span>
          </div>
        </div>
      )}

      {/* 4x4 Grid Matrix Container */}
      <div className={`flex-1 flex flex-col justify-center ${isScrambling ? 'animate-scramble' : ''}`}>
        {/* Labeled Column Headers: A, B, C, D */}
        <div className="grid grid-cols-[36px_repeat(4,1fr)] gap-1.5 mb-1.5 text-center font-display font-bold text-slate-300 text-xs sm:text-sm">
          <div className="flex items-center justify-center font-mono text-[10px] text-slate-500">
            #
          </div>
          {colHeaders.map((col) => {
            const isColOracle = oracleHighlight?.type === 'col' && oracleHighlight.value === col;
            return (
              <div
                key={col}
                className={`py-1 rounded font-mono font-extrabold shadow-xs transition-colors ${
                  isColOracle
                    ? 'bg-purple-900 border-2 border-purple-400 text-purple-200 ring-1 ring-purple-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                }`}
              >
                {col}
              </div>
            );
          })}
        </div>

        {/* Rows 1 to 4 with Row Numbers */}
        <div className="space-y-1.5">
          {rowNumbers.map((rowNum, rIdx) => {
            const isRowOracle = oracleHighlight?.type === 'row' && oracleHighlight.value === rowNum;
            return (
              <div key={rowNum} className="grid grid-cols-[36px_repeat(4,1fr)] gap-1.5 items-stretch">
                {/* Row Number Header */}
                <div
                  className={`flex items-center justify-center rounded font-mono font-extrabold text-xs sm:text-sm shadow-xs transition-colors ${
                    isRowOracle
                      ? 'bg-purple-900 border-2 border-purple-400 text-purple-200 ring-1 ring-purple-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                  }`}
                >
                  {rowNum}
                </div>

                {/* 4 Cells for this row */}
                {colHeaders.map((colChar, cIdx) => {
                  const item = getItemAt(rIdx, cIdx);
                  const coordLabel = `${colChar}${rowNum}`;
                  const isTarget = !isFox && showRoleSecret && isTargetCell(rowNum, colChar);
                  const isSelectedForGuess = selectedGuessWord === item;
                  const isOracleHighlighted =
                    Boolean(oracleHighlight) &&
                    ((oracleHighlight?.type === 'row' && oracleHighlight.value === rowNum) ||
                      (oracleHighlight?.type === 'col' && oracleHighlight.value === colChar));

                  // Alternating subtle tone inside matrix
                  const isEvenCell = (rIdx + cIdx) % 2 === 0;

                  return (
                    <button
                      key={coordLabel}
                      disabled={!isFoxGuesser}
                      onClick={() => {
                        if (isFoxGuesser && onSelectWordGuess) {
                          onSelectWordGuess(item, coordLabel);
                        }
                      }}
                      className={`relative p-2 sm:p-2.5 rounded-lg border-2 text-left transition-all flex flex-col justify-between min-h-[58px] sm:min-h-[64px] ${
                        isTarget
                          ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 text-emerald-200 font-bold shadow-md'
                          : isSelectedForGuess
                          ? 'bg-amber-400 border-amber-300 text-slate-950 font-black ring-2 ring-amber-400 scale-[1.02] shadow-md'
                          : isOracleHighlighted
                          ? 'ring-2 ring-purple-400 bg-purple-950/40 border-purple-400 text-purple-200 font-bold shadow-md'
                          : isEvenCell
                          ? 'bg-slate-800/90 border-slate-700 hover:border-slate-500 text-slate-100'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 text-slate-100'
                      } ${
                        isFoxGuesser
                          ? 'cursor-pointer hover:border-amber-400 hover:bg-slate-700 hover:scale-[1.01] active:scale-[0.98]'
                          : 'cursor-default'
                      }`}
                    >
                      {/* Coordinate micro-label */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono font-bold leading-none ${
                            isTarget
                              ? 'text-emerald-400'
                              : isOracleHighlighted
                              ? 'text-purple-300 font-black'
                              : 'text-slate-400'
                          }`}
                        >
                          {coordLabel}
                        </span>
                        {isTarget && (
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                          </span>
                        )}
                        {isOracleHighlighted && !isTarget && (
                          <span className="text-[10px] select-none text-purple-400">
                            ✦
                          </span>
                        )}
                      </div>

                      {/* Word text */}
                      <span className="text-xs sm:text-sm font-semibold tracking-tight leading-tight line-clamp-2 mt-1">
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Matrix Legend / Instructions */}
      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Coordinate map: 4 Columns (A-D) × 4 Rows (1-4)</span>
        {isFox && (
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Don't get caught!
          </span>
        )}
      </div>
    </div>
  );
};
