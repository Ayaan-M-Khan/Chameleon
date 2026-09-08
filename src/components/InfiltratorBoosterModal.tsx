import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Coins, TrendingUp, HelpCircle, Check, Dices, Award } from 'lucide-react';
import { Player } from '../types';
import { sound } from '../utils/sound';

interface InfiltratorBoosterModalProps {
  isOpen: boolean;
  players?: Player[];
  allPlayers?: Player[];
  activePlayer?: Player;
  player?: Player;
  onUpdateBoost: (playerId: string, goldAmount: number) => void;
  onClose: () => void;
}

export const InfiltratorBoosterModal: React.FC<InfiltratorBoosterModalProps> = ({
  isOpen,
  players: propPlayers,
  allPlayers,
  activePlayer: propActivePlayer,
  player: propPlayer,
  onUpdateBoost,
  onClose,
}) => {
  const currentActivePlayer = propActivePlayer || propPlayer;
  const currentPlayers = propPlayers || allPlayers || [];

  const currentGold = currentActivePlayer?.gold ?? 0;
  const initialBoost = currentActivePlayer?.infiltratorBoostGold ?? currentActivePlayer?.chameleonBoostGold ?? 0;
  const [selectedGold, setSelectedGold] = useState<number>(initialBoost);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen && currentActivePlayer) {
      setSelectedGold(currentActivePlayer.infiltratorBoostGold ?? currentActivePlayer.chameleonBoostGold ?? 0);
    }
  }, [isOpen, currentActivePlayer?.infiltratorBoostGold, currentActivePlayer?.chameleonBoostGold]);

  // Probability calculations: strictly private to currentActivePlayer
  const myExtraTickets = Math.floor(selectedGold / 50);
  const myTotalTickets = 1 + myExtraTickets;

  const { myPercentage, totalRoomTickets } = useMemo(() => {
    const targetPlayerId = currentActivePlayer?.id;
    let totalTickets = 0;
    currentPlayers.forEach((p) => {
      const isSelf = p.id === targetPlayerId;
      const boostGold = isSelf ? selectedGold : (p.infiltratorBoostGold ?? p.chameleonBoostGold ?? 0);
      const tickets = 1 + Math.floor(boostGold / 50);
      totalTickets += tickets;
    });

    const percentage = totalTickets > 0 ? (myTotalTickets / totalTickets) * 100 : 0;
    return {
      myPercentage: percentage.toFixed(1),
      totalRoomTickets: totalTickets,
    };
  }, [currentPlayers, currentActivePlayer?.id, selectedGold, myTotalTickets]);

  if (!isOpen || !currentActivePlayer) return null;

  const handleSave = () => {
    sound.powerup();
    onUpdateBoost(currentActivePlayer.id, selectedGold);
    onClose();
  };

  const presetTiers = [
    { label: 'Standard (0g)', gold: 0, extraTickets: 0 },
    { label: '+1 Ticket (50g)', gold: 50, extraTickets: 1 },
    { label: '+2 Tickets (100g)', gold: 100, extraTickets: 2 },
    { label: '+3 Tickets (150g)', gold: 150, extraTickets: 3 },
    { label: '+4 Tickets (200g)', gold: 200, extraTickets: 4 },
  ];

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
          className="relative z-10 w-full max-w-lg bg-[#111726] border-2 border-amber-500/80 rounded-2xl shadow-2xl shadow-amber-950/70 text-slate-100 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 sm:p-5 border-b-2 border-amber-500/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl select-none">🕵️</span>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <span>INFILTRATOR ODDS BOOSTER</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-900/90 text-amber-200 border border-amber-400 px-2 py-0.5 rounded">
                    Gold Bribe
                  </span>
                </h3>
                <p className="text-xs text-amber-200/80 font-mono">
                  Use gold to increase your probability of drawing The Infiltrator role
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
            {/* Balance & Odds Summary Banner */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/40 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                  Your Gold Balance
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xl select-none">🪙</span>
                  <span className="text-lg font-mono font-black text-amber-300">
                    {currentGold}g
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/50 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Your Infiltrator Chance
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono font-black text-yellow-300">
                    {myPercentage}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">
                    ({myTotalTickets} of {totalRoomTickets} tickets)
                  </span>
                </div>
              </div>
            </div>

            {/* How it Works Callout */}
            <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold">How the Lottery Works:</strong>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Every player starts with <strong>1 base ticket</strong>. Every <strong>50 gold</strong> you invest adds <strong>+1 extra ticket</strong> into the dealer's lottery hat. Gold is deducted only when the round begins!
                </p>
              </div>
            </div>

            {/* Boost Tier Buttons */}
            <div>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-300 mb-2">
                Select Gold Investment:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetTiers.map((tier) => {
                  const isSelected = selectedGold === tier.gold;
                  const canAfford = currentGold >= tier.gold;

                  return (
                    <button
                      key={tier.gold}
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        sound.click();
                        setSelectedGold(tier.gold);
                      }}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                          : canAfford
                          ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600 text-slate-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {tier.label}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 font-black" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold mt-1">
                        {tier.gold === 0 ? 'Free' : `🪙 -${tier.gold}g`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Your Probability Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Your Infiltrator Chance
                </span>
                <span className="text-yellow-300 font-bold text-sm">{myPercentage}%</span>
              </div>
              <div className="w-full h-3.5 rounded-full overflow-hidden bg-slate-900 flex border border-slate-700">
                <div
                  style={{ width: `${Math.min(100, Math.max(5, parseFloat(myPercentage)))}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                <span>Lottery Share: {myTotalTickets} of {totalRoomTickets} total tickets</span>
                <span>Base odds: {(100 / Math.max(1, currentPlayers.length)).toFixed(1)}%</span>
              </div>
            </div>

            {/* Personal Investment & Ticket Summary */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Your Current Gold:</span>
                <span className="font-mono font-bold text-amber-300">🪙 {currentGold}g</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Your Gold Bribe</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {selectedGold > 0 ? `🪙 -${selectedGold}g` : '0g (Free)'}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Your Tickets</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {myTotalTickets} 🎟️ <span className="text-[10px] text-amber-300 font-normal">({1} base + {myExtraTickets} bonus)</span>
                  </span>
                </div>
              </div>

              {/* Confidentiality Notice */}
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                <span className="text-emerald-400 mt-0.5">🔒</span>
                <span>
                  <strong className="text-white">Confidential Investment:</strong> Other players cannot see your gold bribe or your odds. Only your private chance is displayed.
                </span>
              </div>
            </div>
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
              onClick={handleSave}
              className="retro-button px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-display font-black uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer border border-amber-300"
            >
              <Coins className="w-4 h-4" />
              <span>Lock In Boost ({selectedGold}g)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
