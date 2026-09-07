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
            onClick={onConfirmReady}
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
        </div>
      </div>
    </div>
  );
};
