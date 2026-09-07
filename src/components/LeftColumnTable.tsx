import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, Bot, User, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Player, GamePhase } from '../types';

interface LeftColumnTableProps {
  players: Player[];
  activePlayerId: string;
  gamePhase: GamePhase;
  anonymousVoting: boolean;
  onSelectVoteTarget?: (targetId: string) => void;
  selectedVoteTargetId?: string | null;
  canVoteNow: boolean;
}

export const LeftColumnTable: React.FC<LeftColumnTableProps> = ({
  players,
  activePlayerId,
  gamePhase,
  anonymousVoting,
  onSelectVoteTarget,
  selectedVoteTargetId,
  canVoteNow,
}) => {
  const [showAllCluesLocally, setShowAllCluesLocally] = React.useState(false);

  // During clue submission, hide others' clues if still writing, or reveal when submitted
  // When voting or resolution, clues are fully public!
  const isVotingOrResolution = gamePhase === 'voting' || gamePhase === 'fox_guess' || gamePhase === 'round_resolution';

  // Clues submitted & votes cast counts
  const cluesSubmittedCount = players.filter((p) => p.hasSubmittedClue).length;
  const votesCastCount = players.filter((p) => Boolean(p.votedForId)).length;

  return (
    <div className="retro-card rounded-xl p-4 sm:p-5 flex flex-col h-full bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl overflow-hidden">
      {/* Table Header & Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h2 className="text-base sm:text-xl font-display font-bold uppercase tracking-tight text-white">
            Players & Clues
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {gamePhase === 'clue_submission' && (
            <button
              onClick={() => setShowAllCluesLocally(!showAllCluesLocally)}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 transition-colors"
              title="Toggle preview visibility of submitted clues"
            >
              {showAllCluesLocally ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="hidden sm:inline">{showAllCluesLocally ? 'Mask Early Clues' : 'Peek Clues'}</span>
            </button>
          )}

          {gamePhase === 'clue_submission' ? (
            <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              Clues: {cluesSubmittedCount}/{players.length}
            </span>
          ) : gamePhase === 'voting' ? (
            <span className="text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              Votes: {votesCastCount}/{players.length}
            </span>
          ) : (
            <span className="text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700 px-2.5 py-0.5 rounded-md">
              {players.length} Players
            </span>
          )}
        </div>
      </div>

      {/* Expanded Table container with strict column containment and no scroll overflow */}
      <div className="w-full flex-1 overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse text-xs sm:text-sm">
          <colgroup>
            <col className="w-[26%] sm:w-[24%]" />
            <col className="w-[14%] sm:w-[12%]" />
            <col className="w-[38%] sm:w-[42%]" />
            <col className="w-[12%] sm:w-[10%]" />
            <col className="w-[10%] sm:w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-800/90 text-slate-300 font-display font-bold uppercase text-[11px] sm:text-xs tracking-wider">
              <th className="py-3 px-2 sm:px-3 text-left rounded-tl-lg">Player</th>
              <th className="py-3 px-1 sm:px-2 text-center">Score</th>
              <th className="py-3 px-2 sm:px-3 text-left">Word / Clue</th>
              <th className="py-3 px-1 sm:px-2 text-center">Ready (✓)</th>
              <th className="py-3 px-2 sm:px-3 text-center sm:text-right rounded-tr-lg">Vote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {players.map((p) => {
              const isCurrent = p.id === activePlayerId;
              const hasClue = Boolean(p.clue && p.hasSubmittedClue);

              // Voting indicator logic
              const votedTarget = players.find(target => target.id === p.votedForId);
              const isClickableTarget = canVoteNow && p.id !== activePlayerId;
              const isSelectedTarget = selectedVoteTargetId === p.id;

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    isCurrent ? 'bg-slate-800/70 border-l-2 border-l-emerald-400' : 'hover:bg-slate-800/40'
                  } ${isSelectedTarget ? 'ring-2 ring-rose-500 bg-rose-950/30' : ''}`}
                >
                  {/* Player info */}
                  <td className="py-3 px-2 sm:px-3 align-middle overflow-hidden">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="text-xl select-none shrink-0" role="img" aria-label="avatar">
                        {p.avatar || '👤'}
                      </span>
                      <div className="min-w-0 flex-1 truncate">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-bold text-white text-xs sm:text-sm truncate">
                            {p.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase tracking-tighter shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {p.isHuman ? (
                            <span className="flex items-center gap-0.5 text-cyan-400 truncate">
                              <User className="w-2.5 h-2.5 shrink-0" /> Human
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-amber-400 truncate">
                              <Bot className="w-2.5 h-2.5 shrink-0" /> Bot
                            </span>
                          )}
                          {p.isHost && (
                            <span className="text-purple-400 font-semibold text-[10px] shrink-0">
                              • Host
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-1 sm:px-2 text-center align-middle">
                    <span className="inline-flex items-center justify-center font-mono font-bold text-slate-200 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs">
                      {p.score} <span className="text-[10px] text-slate-400 ml-0.5">pts</span>
                    </span>
                  </td>

                  {/* Word / Clue - Expanded with wrapping and strictly contained */}
                  <td className="py-3 px-2 sm:px-3 align-middle min-w-0 overflow-hidden">
                    {hasClue ? (
                      // Clue is visible during voting/results, or if it's the current player, or if peek is enabled
                      isVotingOrResolution || p.id === activePlayerId || showAllCluesLocally ? (
                        <div className="w-full bg-amber-950/50 border border-amber-500/50 text-amber-200 font-bold px-2.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-mono tracking-tight shadow-xs break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-normal leading-relaxed overflow-hidden">
                          "{p.clue}"
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-400 font-mono text-xs italic bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                          <span>🔒 Clue Locked</span>
                        </div>
                      )
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-slate-500 text-xs italic">
                        <Clock className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </td>

                  {/* Ready (✓) - Strictly centered and well inside the container */}
                  <td className="py-3 px-1 sm:px-2 text-center align-middle whitespace-nowrap overflow-hidden">
                    <div className="flex items-center justify-center">
                      {p.hasSubmittedClue || p.isReady ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/60 font-bold text-xs shadow-xs" title="Clue ready">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-slate-500 border border-slate-700 text-xs" title="Waiting for clue">
                          …
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vote column */}
                  <td className="py-3 px-2 sm:px-3 text-center sm:text-right align-middle overflow-hidden">
                    {gamePhase === 'voting' ? (
                      // Voting in progress
                      p.votedForId ? (
                        anonymousVoting ? (
                          <span className="inline-flex items-center gap-1 bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded text-[11px] font-bold">
                            <Check className="w-3 h-3" /> Voted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono truncate">
                            👉 {votedTarget?.name.split(' ')[0] || 'Unknown'}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium italic">
                          <Clock className="w-3 h-3 animate-spin text-amber-400" /> Deciding…
                        </span>
                      )
                    ) : isVotingOrResolution ? (
                      p.votedForId ? (
                        <span className="inline-flex items-center gap-1 bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono truncate">
                          👉 {votedTarget?.name.split(' ')[0] || 'Pass'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">—</span>
                      )
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">—</span>
                    )}

                    {/* Quick vote button if user is choosing targets */}
                    {isClickableTarget && (
                      <button
                        onClick={() => onSelectVoteTarget?.(p.id)}
                        className={`mt-1 sm:mt-0 sm:ml-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border transition-all ${
                          isSelectedTarget
                            ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                            : 'bg-slate-800 hover:bg-rose-950 text-slate-200 border-slate-600 hover:border-rose-500'
                        }`}
                      >
                        {isSelectedTarget ? 'Targeted' : 'Accuse'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Pill */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Each player gives <strong>one clue</strong> (up to 80 chars) related to the coordinate.</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400 font-semibold">
          Clue limit: 80 chars
        </span>
      </div>
    </div>
  );
};
