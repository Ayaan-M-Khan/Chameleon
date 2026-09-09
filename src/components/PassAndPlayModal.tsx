import React from 'react';
import { ShieldAlert, UserCheck, CheckCircle2 } from 'lucide-react';
import { Player, GamePhase } from '../types';

interface PassAndPlayModalProps {
  isOpen: boolean;
  player: Player | null;
  onConfirmReady: () => void;
  gamePhase?: GamePhase;
}

export const PassAndPlayModal: React.FC<PassAndPlayModalProps> = ({
  isOpen,
  player,
  onConfirmReady,
  gamePhase = 'clue_submission',
}) => {
  const [holdProgress, setHoldProgress] = React.useState(0);
  const holdTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartedAtRef = React.useRef(0);

  const cancelHold = React.useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    holdStartedAtRef.current = 0;
    setHoldProgress(0);
  }, []);

  const startHold = React.useCallback(() => {
    if (holdTimerRef.current) return;
    holdStartedAtRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const progress = Math.min(1, (Date.now() - holdStartedAtRef.current) / 3000);
      setHoldProgress(progress);
      if (progress >= 1) {
        cancelHold();
        onConfirmReady();
      }
    }, 50);
  }, [cancelHold, onConfirmReady]);

  React.useEffect(() => cancelHold, [cancelHold, isOpen, player?.id]);

  if (!isOpen || !player) return null;

  const isVoting = gamePhase === 'voting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="retro-card rounded-2xl w-full max-w-md bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500 border border-slate-700 flex items-center justify-center text-3xl shadow-md">
          {player.avatar}
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-950/80 text-rose-300 border border-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pass the Device</span>
          </div>

          <h3 className="font-display font-black text-2xl text-white uppercase">
            Hand over to {player.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {isVoting
              ? 'Ensure no other players can see your screen before pressing the button below to secretly cast your accusation vote!'
              : 'Ensure no other players can see your screen before pressing the button below to view your secret role & enter your clue!'}
          </p>
        </div>

        <div className="pt-3">
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') startHold();
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') cancelHold();
            }}
            aria-label={`Hold for 3 seconds to reveal ${player.name}'s turn`}
            className="w-full retro-button py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            {isVoting ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>I am {player.name} — Cast My Secret Vote</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>I am {player.name} — Reveal My Turn</span>
              </>
            )}
          </button>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
            <div
              className="h-full rounded-full bg-amber-300 transition-[width]"
              style={{ width: `${holdProgress * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Hold for 3 seconds to reveal
          </p>
        </div>
      </div>
    </div>
  );
};
