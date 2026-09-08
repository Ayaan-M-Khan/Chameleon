import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Coins, TrendingUp, HelpCircle, Check, Dices, Award } from 'lucide-react';
import { Player } from '../types';
import { sound } from '../utils/sound';

interface ChameleonBoosterModalProps {
  isOpen: boolean;
  players: Player[];
  activePlayer: Player;
  onUpdateBoost: (playerId: string, goldAmount: number) => void;
  onClose: () => void;
}

export const ChameleonBoosterModal: React.FC<ChameleonBoosterModalProps> = ({
  isOpen,
  players,
  activePlayer,
  onUpdateBoost,
  onClose,
}) => {
  const currentGold = activePlayer.gold ?? 0;
  const initialBoost = activePlayer.chameleonBoostGold ?? 0;
  const [selectedGold, setSelectedGold] = useState<number>(initialBoost);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedGold(activePlayer.chameleonBoostGold ?? 0);
    }
  }, [isOpen, activePlayer.chameleonBoostGold]);

  // Probability calculations
  const oddsBreakdown = useMemo(() => {
    const ticketMap = players.map((p) => {
      const isSelf = p.id === activePlayer.id;
      const boostGold = isSelf ? selectedGold : (p.chameleonBoostGold ?? 0);
      const extraTickets = Math.floor(boostGold / 50);
      const totalTickets = 1 + extraTickets;
      return {
        player: p,
        isSelf,
        boostGold,
        tickets: totalTickets,
      };
    });

    const totalTicketsAll = ticketMap.reduce((acc, curr) => acc + curr.tickets, 0);

    return ticketMap.map((item) => ({
      ...item,
      percentage: totalTicketsAll > 0 ? (item.tickets / totalTicketsAll) * 100 : 0,
      totalTicketsAll,
    }));
  }, [players, activePlayer.id, selectedGold]);

  const myOdds = oddsBreakdown.find((o) => o.isSelf);
  const myPercentage = myOdds ? myOdds.percentage.toFixed(1) : '25.0';

  if (!isOpen) return null;

  const handleSave = () => {
    sound.powerup();
    onUpdateBoost(activePlayer.id, selectedGold);
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
              <span className="text-2xl select-none">🦎</span>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <span>CHAMELEON ODDS BOOSTER</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-900/90 text-amber-200 border border-amber-400 px-2 py-0.5 rounded">
                    Gold Bribe
                  </span>
                </h3>
                <p className="text-xs text-amber-200/80 font-mono">
                  Use gold to increase your probability of drawing the Chameleon role
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
                  Your Chameleon Chance
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono font-black text-yellow-300">
                    {myPercentage}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">
                    ({myOdds?.tickets} of {myOdds?.totalTicketsAll} tickets)
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

            {/* Probability Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Room Probability Share</span>
                <span className="text-amber-300 font-bold">Total: 100%</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-slate-900 flex border border-slate-700">
                {oddsBreakdown.map((item, idx) => {
                  const colors = ['bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-sky-500', 'bg-rose-500'];
                  const color = item.isSelf ? 'bg-amber-400' : colors[idx % colors.length];
                  return (
                    <div
                      key={item.player.id}
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full ${color} transition-all duration-300`}
                      title={`${item.player.name}: ${item.percentage.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Odds Table Breakdown */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-800/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2 text-center">Gold Invested</th>
                    <th className="p-2 text-center">Tickets</th>
                    <th className="p-2 text-right">Chameleon Chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {oddsBreakdown.map((item) => (
                    <tr
                      key={item.player.id}
                      className={item.isSelf ? 'bg-amber-950/30 font-bold text-amber-200' : 'text-slate-300'}
                    >
                      <td className="p-2 flex items-center gap-1.5 truncate">
                        <span>{item.player.avatar}</span>
                        <span className="truncate">{item.player.name}</span>
                        {item.isSelf && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black">
                            YOU
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center font-mono text-amber-300">
                        {item.boostGold > 0 ? `🪙 ${item.boostGold}g` : '0g'}
                      </td>
                      <td className="p-2 text-center font-mono font-bold">
                        {item.tickets} 🎟️
                      </td>
                      <td className="p-2 text-right font-mono font-black text-yellow-300">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
