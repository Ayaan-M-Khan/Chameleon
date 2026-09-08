import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, Bot, User, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { Player, GamePhase, PlayerInventory } from '../types';
import { POTION_CATALOG } from '../data/potions';

interface LeftColumnTableProps {
  players: Player[];
  activePlayerId: string;
  activePlayerRole?: 'innocent' | 'fox';
  impostorPeekPlayerId?: string | null;
  clueLensPeekPlayerId?: string | null;
  activeVoteShields?: string[];
  gamePhase: GamePhase;
  anonymousVoting: boolean;
  onSelectVoteTarget?: (targetId: string) => void;
  selectedVoteTargetId?: string | null;
  canVoteNow: boolean;
  hasUsedPotionThisTurn?: boolean;
  onUsePotion?: (potionId: string) => void;
  recentlyUsedPotionPlayerId?: string | null;
  inventory?: PlayerInventory;
  gold?: number;
}

export const LeftColumnTable: React.FC<LeftColumnTableProps> = ({
  players,
  activePlayerId,
  activePlayerRole = 'innocent',
  impostorPeekPlayerId = null,
  clueLensPeekPlayerId = null,
  activeVoteShields = [],
  gamePhase,
  anonymousVoting,
  onSelectVoteTarget,
  selectedVoteTargetId,
  canVoteNow,
  hasUsedPotionThisTurn = false,
  onUsePotion,
  recentlyUsedPotionPlayerId = null,
  inventory = {},
  gold = 0,
}) => {
  // During clue submission:
  // - Innocents see ONLY their own clue
  // - Imposter sees their own clue + exactly 1 random other player's clue (+ 2nd clue if clue lens used)
  // When voting or resolution, clues are fully public to all players!
  const isVotingOrResolution = gamePhase === 'voting' || gamePhase === 'fox_guess' || gamePhase === 'round_resolution';
  const isImpostor = activePlayerRole === 'fox';

  // Clues submitted & votes cast counts
  const cluesSubmittedCount = players.filter((p) => p.hasSubmittedClue).length;
  const votesCastCount = players.filter((p) => Boolean(p.votedForId)).length;

  // Filter potions for inventory panel
  const compatiblePotions = POTION_CATALOG.filter((item) => {
    const matchesRole = item.roleTarget === 'all' ||
      (item.roleTarget === 'fox' && isImpostor) ||
      (item.roleTarget === 'innocent' && !isImpostor);
    const quantity = inventory[item.id] || 0;
    return matchesRole && quantity > 0;
  }).map((item) => ({
    potion: item,
    quantity: inventory[item.id] || 0,
  }));

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
          {gamePhase === 'clue_submission' && isImpostor && (
            <span className="text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-600 px-2 py-0.5 rounded-md flex items-center gap-1">
              🦎 Chameleon Intel
            </span>
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

      {/* Expanded Table container with responsive horizontal scroll and generous column containment */}
      <div className="w-full flex-1 overflow-x-auto overflow-y-auto min-h-[220px]">
        <table className="w-full min-w-[560px] sm:min-w-full table-fixed text-left border-collapse text-xs sm:text-sm">
          <colgroup>
            <col className="w-[23%] sm:w-[21%]" />
            <col className="w-[11%] sm:w-[10%]" />
            <col className="w-[36%] sm:w-[37%]" />
            <col className="w-[8%] sm:w-[8%]" />
            <col className="w-[22%] sm:w-[24%]" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-800/90 text-slate-300 font-display font-bold uppercase text-[11px] sm:text-xs tracking-wider">
              <th className="py-3 px-2 sm:px-3 text-left rounded-tl-lg">Player</th>
              <th className="py-3 px-1 sm:px-2 text-center">Score</th>
              <th className="py-3 px-2 sm:px-3 text-left">Word / Clue</th>
              <th className="py-3 px-1 sm:px-2 text-center">Ready</th>
              <th className="py-3 px-2 sm:px-3 text-right rounded-tr-lg">Decision / Vote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {players.map((p) => {
              const isCurrent = p.id === activePlayerId;
              // During voting/resolution, any submitted non-empty clue is considered present
              const hasClue = isVotingOrResolution
                ? Boolean(p.clue && p.clue.trim() !== '')
                : Boolean(p.clue && p.hasSubmittedClue);
              const isImpostorPeekTarget = isImpostor && p.id === impostorPeekPlayerId;
              const isClueLensTarget = isImpostor && p.id === clueLensPeekPlayerId;

              // Visibility rules:
              // 1. Voting/Resolution: all clues are 100% public to all players!
              // 2. Clue submission:
              //    - Current active player always sees their own clue
              //    - Imposter (Chameleon) sees exactly ONE other player's clue at random (+ 2nd clue if Clue Lens active)
              //    - Innocents see NO other players' clues
              const isClueVisible =
                isVotingOrResolution ||
                isCurrent ||
                (gamePhase === 'clue_submission' && (isImpostorPeekTarget || isClueLensTarget));

              // Voting indicator logic
              const votedTarget = players.find(target => target.id === p.votedForId);
              const isClickableTarget = canVoteNow && p.id !== activePlayerId;
              const isSelectedTarget = selectedVoteTargetId === p.id;
              const isShielded = activeVoteShields.includes(p.id);

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    isCurrent ? 'bg-slate-800/70 border-l-2 border-l-emerald-400' : 'hover:bg-slate-800/40'
                  } ${isSelectedTarget ? 'ring-2 ring-rose-500 bg-rose-950/30' : ''} ${
                    recentlyUsedPotionPlayerId === p.id ? 'animate-potion-bubble ring-2 ring-purple-400' : ''
                  }`}
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
                          {isShielded && (
                            <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-600 px-1 rounded font-mono font-bold flex items-center gap-0.5 shrink-0" title="Vote Shield Active (-1 vote against you)">
                              <Shield className="w-2.5 h-2.5 text-sky-400" /> Shielded
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
                      isClueVisible ? (
                        <div
                          className={`w-full ${
                            isImpostorPeekTarget && gamePhase === 'clue_submission'
                              ? 'bg-purple-950/70 border-purple-500/80 text-purple-200 shadow-sm'
                              : isClueLensTarget && gamePhase === 'clue_submission'
                              ? 'bg-cyan-950/70 border-cyan-400/80 text-cyan-200 shadow-sm'
                              : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                          } border font-bold px-2.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-mono tracking-tight shadow-xs break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-normal leading-relaxed overflow-hidden`}
                        >
                          "{p.clue}"
                          {isImpostorPeekTarget && gamePhase === 'clue_submission' && (
                            <span className="block mt-1 text-[10px] font-sans font-extrabold uppercase tracking-wider text-purple-300">
                              🦎 Chameleon Intel (1 Clue)
                            </span>
                          )}
                          {isClueLensTarget && gamePhase === 'clue_submission' && (
                            <span className="block mt-1 text-[10px] font-sans font-extrabold uppercase tracking-wider text-cyan-300">
                              👁️ Clue Lens Intel (2nd Clue)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-400 font-mono text-xs italic bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                          <span>🔒 Clue Locked</span>
                        </div>
                      )
                    ) : isVotingOrResolution ? (
                      <span className="text-slate-500 font-mono text-xs italic">No clue</span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-slate-500 text-xs italic">
                        <Clock className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </td>

                  {/* Ready (✓) - Strictly centered */}
                  <td className="py-3 px-1 sm:px-2 text-center align-middle whitespace-nowrap">
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

                  {/* Vote column with generous space and no cutoff */}
                  <td className="py-3 px-2 sm:px-3 text-right align-middle">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                      {gamePhase === 'voting' ? (
                        // Voting in progress
                        p.votedForId ? (
                          anonymousVoting ? (
                            <span className="inline-flex items-center gap-1 bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap shadow-xs">
                              <Check className="w-3 h-3 text-purple-400" /> Voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-950/90 text-rose-200 border border-rose-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono whitespace-nowrap shadow-xs" title={`Voted for ${votedTarget?.name || 'Unknown'}`}>
                              👉 {votedTarget?.name.split(' ')[0] || 'Unknown'}
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-medium italic whitespace-nowrap">
                            <Clock className="w-3 h-3 animate-spin text-amber-400 shrink-0" /> Deciding…
                          </span>
                        )
                      ) : isVotingOrResolution ? (
                        p.votedForId ? (
                          <span className="inline-flex items-center gap-1 bg-rose-950/90 text-rose-200 border border-rose-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono whitespace-nowrap shadow-xs">
                            👉 {votedTarget?.name.split(' ')[0] || 'Pass'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">—</span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">—</span>
                      )}

                      {/* Quick vote / accuse button if user can vote or change vote */}
                      {isClickableTarget && (
                        <button
                          onClick={() => onSelectVoteTarget?.(p.id)}
                          className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                            isSelectedTarget
                              ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-1 ring-rose-300'
                              : 'bg-slate-800 hover:bg-rose-950 text-slate-200 border-slate-600 hover:border-rose-500'
                          }`}
                          title={`Select ${p.name} as Chameleon accusation`}
                        >
                          {isSelectedTarget ? 'Selected' : 'Accuse'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🧪 POTIONS & ITEMS (1 use per turn) */}
      <div className="mt-3 pt-3 border-t-2 border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base select-none">🧪</span>
            <h3 className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-purple-200">
              POTIONS & ITEMS
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              (1 use per turn)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/60">
              🪙 {gold}g
            </span>
            {hasUsedPotionThisTurn ? (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600 px-1.5 py-0.5 rounded">
                Used This Turn ✓
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600 px-1.5 py-0.5 rounded">
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Potion List */}
        {compatiblePotions.length > 0 ? (
          <div className="space-y-1.5">
            {compatiblePotions.map(({ potion, quantity }) => (
              <div
                key={potion.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl select-none shrink-0">{potion.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs truncate">
                        {potion.name}
                      </span>
                      <span className="font-mono text-purple-300 font-black text-[11px] bg-purple-950 px-1.5 py-0.2 rounded border border-purple-700">
                        x{quantity}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {potion.description}
                    </span>
                  </div>
                </div>

                <button
                  disabled={hasUsedPotionThisTurn}
                  onClick={() => onUsePotion?.(potion.id)}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-[11px] font-display font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    hasUsedPotionThisTurn
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
                      : 'retro-button bg-purple-600 hover:bg-purple-500 active:scale-95 text-white border-purple-400 shadow-xs'
                  }`}
                  title={hasUsedPotionThisTurn ? 'Already used 1 potion this turn' : `Use ${potion.name}`}
                >
                  USE
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between px-3">
            <span>No role potions in inventory.</span>
            <span className="text-[10px] font-mono text-amber-300 font-bold">
              Shop opens every 3 rounds! 🛒
            </span>
          </div>
        )}
      </div>

      {/* Footer Info Pill */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
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
