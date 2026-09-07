import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertOctagon, RotateCcw, Trophy, Sparkles, Clock, ArrowRight, Eye } from 'lucide-react';
import { Player, GamePhase, RoundResolution, GameSettings } from '../types';

interface ActionTrayProps {
  gamePhase: GamePhase;
  activePlayer: Player;
  players: Player[];
  settings: GameSettings;
  timeLeft: number;
  // Clue Entry
  clueInput: string;
  onChangeClueInput: (val: string) => void;
  onSubmitClue: () => void;
  // Voting
  selectedVoteTargetId: string | null;
  onSelectVoteTarget: (id: string) => void;
  onSubmitVote: () => void;
  hasCurrentPlayerVoted: boolean;
  // Fox Guess
  selectedGuessWord: string | null;
  onSubmitFoxGuess: () => void;
  isCurrentPlayerTheCaughtFox: boolean;
  caughtFoxPlayer: Player | null;
  // Resolution
  roundResolution: RoundResolution | null;
  onNextRound: () => void;
  onOpenResolutionModal?: () => void;
}

export const ActionTray: React.FC<ActionTrayProps> = ({
  gamePhase,
  activePlayer,
  players,
  settings,
  timeLeft,
  clueInput,
  onChangeClueInput,
  onSubmitClue,
  selectedVoteTargetId,
  onSelectVoteTarget,
  onSubmitVote,
  hasCurrentPlayerVoted,
  selectedGuessWord,
  onSubmitFoxGuess,
  isCurrentPlayerTheCaughtFox,
  caughtFoxPlayer,
  roundResolution,
  onNextRound,
  onOpenResolutionModal,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (gamePhase === 'clue_submission' && !activePlayer.hasSubmittedClue) {
      inputRef.current?.focus();
    }
  }, [gamePhase, activePlayer.hasSubmittedClue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmitClue();
    }
  };

  return (
    <section className="retro-card rounded-xl p-4 bg-[#131B2E] border-2 border-slate-700 text-slate-100 mt-4 shadow-xl">
      {/* Turn Timer Bar (if enabled in settings) */}
      {settings.turnTimer && (gamePhase === 'clue_submission' || gamePhase === 'voting') && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
              Timer: {timeLeft}s remaining
            </span>
            <span className="text-[11px] text-slate-400">60s Turn Limit</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.max(0, (timeLeft / 60) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Animated Game Phase Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gamePhase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* PHASE 1: CLUE ENTRY */}
          {gamePhase === 'clue_submission' && (
        <div>
          {!activePlayer.hasSubmittedClue ? (
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-display font-extrabold uppercase text-white">
                    Your Turn: Enter Your Clue
                  </span>
                  <span className="text-xs text-slate-400">
                    (Up to 80 chars — give a subtle hint without giving away the secret to the Chameleon)
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={clueInput}
                    onChange={(e) => onChangeClueInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Cleats, John Lennon, Serengeti National Park, Bohemian Rhapsody..."
                    maxLength={80}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-xs pr-16"
                  />
                  <span className="absolute right-3 text-[11px] font-mono font-bold text-slate-400">
                    {clueInput.length}/80
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={onSubmitClue}
                  disabled={!clueInput.trim()}
                  className="retro-button px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg font-display font-black text-slate-950 uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Clue</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-emerald-950/60 border-2 border-emerald-500/70 rounded-lg text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-sm">Clue locked in: </span>
                  <span className="font-mono font-black text-sm sm:text-base bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-500 text-yellow-300">
                    "{activePlayer.clue}"
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 animate-pulse">
                Waiting for remaining players...
              </span>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: VOTING PHASE */}
      {gamePhase === 'voting' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                Who's the Chameleon? Vote.
              </h3>
              <p className="text-xs text-slate-400">
                Review everyone's clue in the left table. Cast your vote for the player you suspect is blending in!
              </p>
            </div>

            {hasCurrentPlayerVoted && (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-600 px-2.5 py-1 rounded-md self-start sm:self-auto flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Your vote is cast
              </span>
            )}
          </div>

          {/* Clickable Player Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-3">
            {players
              .filter((p) => p.id !== activePlayer.id)
              .map((p) => {
                const isSelected = selectedVoteTargetId === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={hasCurrentPlayerVoted}
                    onClick={() => onSelectVoteTarget(p.id)}
                    className={`p-2.5 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-rose-600 border-rose-400 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-white shadow-xs'
                    } ${hasCurrentPlayerVoted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xl shrink-0">{p.avatar}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate leading-tight">
                        {p.name}
                      </div>
                      <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                        "{p.clue || '...'}"
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Confirm Vote Button */}
          {!hasCurrentPlayerVoted && (
            <div className="flex justify-end">
              <button
                onClick={onSubmitVote}
                disabled={!selectedVoteTargetId}
                className="retro-button px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 disabled:pointer-events-none rounded-lg font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Cast Vote Accusation</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: CHAMELEON ESCAPE GUESS */}
      {gamePhase === 'fox_guess' && (
        <div className="p-4 bg-amber-950/40 border-2 border-amber-600/70 rounded-lg text-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦊</span>
                <div>
                  <h3 className="font-display font-black text-base uppercase text-yellow-300">
                    Chameleon's Last Stand: {caughtFoxPlayer?.name || 'The Chameleon'} is Caught!
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isCurrentPlayerTheCaughtFox
                      ? 'You were caught! Select the secret tile on the 4x4 matrix above to steal the round (+2 pts)!'
                      : `${caughtFoxPlayer?.name} was voted as the Chameleon! They are reviewing everyone's hints to guess the secret word...`}
                  </p>
                </div>
              </div>
            </div>

            {isCurrentPlayerTheCaughtFox && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={onSubmitFoxGuess}
                  disabled={!selectedGuessWord}
                  className="retro-button px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 disabled:pointer-events-none rounded-lg font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Lock In Escape Guess</span>
                </button>
              </div>
            )}
          </div>

          {/* Revealed hints reminder for the Chameleon's escape */}
          <div className="pt-2 border-t border-amber-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1.5">
              Player Clues / Hints Given This Round:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {players.filter(p => p.clue).map(p => (
                <div key={p.id} className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md text-xs">
                  <span className="text-sm">{p.avatar}</span>
                  <span className="font-bold text-slate-300 text-[11px]">{p.name}:</span>
                  <span className="font-mono font-bold text-amber-300">"{p.clue}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: ROUND RESOLUTION */}
      {gamePhase === 'round_resolution' && roundResolution && (
        <div className="space-y-3">
          {/* Winner Banner */}
          <div
            className={`p-4 rounded-xl border-2 ${
              roundResolution.winner === 'innocents'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
                : 'bg-amber-950/90 border-amber-500 text-amber-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {roundResolution.winner === 'innocents' ? '🏆' : '🦊'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                      {roundResolution.winner === 'innocents' ? 'INNOCENTS WIN' : 'CHAMELEON WINS'}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      {roundResolution.reason === 'innocents_caught_fox' && 'Chameleon caught & missed secret word!'}
                      {roundResolution.reason === 'fox_stole_win' && 'Chameleon was caught, but correctly stole the word!'}
                      {roundResolution.reason === 'fox_escaped_undetected' && 'Chameleon slipped through undetected!'}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-3 flex-wrap text-sm">
                    <span>
                      The Chameleon was: <strong className="font-display underline text-yellow-300">{roundResolution.foxPlayerName}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Secret Word: <strong className="font-mono text-emerald-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{roundResolution.targetWord} ({roundResolution.targetCoordinate})</strong>
                    </span>
                    {roundResolution.foxGuessWord && (
                      <>
                        <span>•</span>
                        <span>
                          Chameleon Guessed: <strong className="font-mono text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{roundResolution.foxGuessWord}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Summary & Next Round */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {onOpenResolutionModal && (
                  <button
                    onClick={onOpenResolutionModal}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Reopen full results modal"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Summary</span>
                  </button>
                )}

                <button
                  onClick={onNextRound}
                  className="retro-button px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Next Round</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(roundResolution.pointsAwarded).map(([pId, data]) => {
              const info = data as { points: number; explanation: string };
              const p = players.find(player => player.id === pId);
              if (!p) return null;
              return (
                <div
                  key={pId}
                  className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-md text-slate-200"
                >
                  <span className="font-bold text-white">{p.name}:</span>
                  <span className="font-mono font-black text-emerald-400">+{info.points} pts</span>
                  <span className="text-[10px] text-slate-400">({info.explanation})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
