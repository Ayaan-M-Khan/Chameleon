import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, ArrowRight, ShieldCheck, Check, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { Player, PotionItem } from '../types';
import { POTION_CATALOG } from '../data/potions';
import { sound } from '../utils/sound';

interface ShopModalProps {
  isOpen: boolean;
  player: Player;
  onBuyPotion: (potionId: string, cost: number) => void;
  onNextRound: () => void;
  roundNumber: number;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  player,
  onBuyPotion,
  onNextRound,
  roundNumber,
}) => {
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentGold = player.gold ?? 0;
  const isChameleon = player.role === 'fox';

  const handleBuy = (item: PotionItem) => {
    if (currentGold < item.cost) return;
    sound.powerup();
    onBuyPotion(item.id, item.cost);
    setJustPurchasedId(item.id);
    setTimeout(() => {
      setJustPurchasedId(null);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative z-10 retro-card rounded-2xl w-full max-w-4xl bg-[#101726] border-2 border-amber-500/70 text-slate-100 shadow-2xl shadow-amber-950/50 my-auto overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 px-6 py-3.5 border-b-2 border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-pulse select-none">🧙‍♂️</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-wider uppercase text-amber-300 flex items-center gap-2 drop-shadow-sm">
                  <span>THE MYSTIC SHOP</span>
                  <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                    Round {roundNumber} Market
                  </span>
                </h2>
                <p className="text-[11px] text-amber-200/80 font-mono">
                  Potions replenish and carry over across rounds
                </p>
              </div>
            </div>

            {/* Top Gold Counter Badge */}
            <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/60 px-3.5 py-1.5 rounded-xl shadow-inner">
              <Coins className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80 block leading-tight">
                  Your Balance
                </span>
                <span className="font-mono font-black text-amber-300 text-sm sm:text-base leading-tight">
                  {currentGold}g Gold
                </span>
              </div>
            </div>
          </div>

          {/* Body Content: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 sm:p-6">
            {/* Left Column: Merchant Avatar & Quotes */}
            <div className="md:col-span-4 flex flex-col items-center justify-between p-4 rounded-xl bg-slate-900/90 border-2 border-slate-700/80 text-center space-y-4">
              <div className="space-y-2 pt-2">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-purple-900 to-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-5xl shadow-xl shadow-purple-950/60">
                    🧙‍♂️
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-amber-300">
                    LV.99
                  </span>
                </div>

                <div className="font-display font-black text-lg text-amber-200 tracking-wide">
                  Mystic Merchant
                </div>

                <div className="relative bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 text-xs text-amber-100/90 font-medium italic">
                  <span className="text-amber-400 font-bold text-sm">“</span>
                  What would you like for your journey? Subtle trickery or keen vision?
                  <span className="text-amber-400 font-bold text-sm">”</span>
                </div>
              </div>

              {/* Player Status In Store */}
              <div className="w-full bg-slate-950/90 p-3 rounded-xl border border-slate-700/80 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-200 flex items-center gap-1">
                    <span>{player.avatar}</span> {player.name}
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Current Secret Role:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase border ${
                    isChameleon
                      ? 'bg-rose-950 text-yellow-300 border-rose-500'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  }`}>
                    {isChameleon ? '🦎 Chameleon' : '🎯 Innocent'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/80 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Only compatible role potions can be used in rounds.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Shop Items Grid */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Available Potions & Artifacts</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Max 1 potion usage per turn in game
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POTION_CATALOG.map((item) => {
                    const isRoleCompatible =
                      item.roleTarget === 'all' ||
                      (item.roleTarget === 'fox' && isChameleon) ||
                      (item.roleTarget === 'innocent' && !isChameleon);

                    const canAfford = currentGold >= item.cost;
                    const isPurchasable = isRoleCompatible && canAfford;
                    const ownedCount = player.inventory?.[item.id] || 0;
                    const isRecent = justPurchasedId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`retro-card p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                          isRoleCompatible
                            ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400/80 shadow-md'
                            : 'bg-slate-900/50 border-slate-800 opacity-60'
                        } ${isRecent ? 'ring-2 ring-emerald-400 bg-emerald-950/40' : ''}`}
                      >
                        {/* Item Card Header */}
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl select-none">{item.icon}</span>
                              <div>
                                <h3 className="font-display font-bold text-sm text-white">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                    item.roleTarget === 'fox'
                                      ? 'text-rose-300 bg-rose-950/80 border-rose-700/60'
                                      : 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60'
                                  }`}>
                                    {item.roleTarget === 'fox' ? 'Chameleon Only' : 'Innocent Only'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-black text-amber-300 text-xs sm:text-sm block">
                                {item.cost}g
                              </span>
                              {ownedCount > 0 && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                  Owned: x{ownedCount}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-snug">
                            {item.description}
                          </p>
                        </div>

                        {/* Buy Button & Constraints */}
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
                          {!isRoleCompatible ? (
                            <span className="text-[10px] font-mono text-slate-500 italic flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-slate-500" />
                              Not for your role
                            </span>
                          ) : !canAfford ? (
                            <span className="text-[10px] font-mono text-rose-400 italic">
                              Need {item.cost - currentGold}g more
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          )}

                          <button
                            disabled={!isPurchasable}
                            onClick={() => handleBuy(item)}
                            className={`retro-button px-3.5 py-1.5 rounded-lg text-xs font-display font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                              isPurchasable
                                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 active:scale-95 shadow-xs'
                                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <span>Buy</span>
                            <span className="font-mono text-[11px]">({item.cost}g)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Inventory Status summary */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                <span className="font-mono text-[11px]">
                  🎒 Your Current Potions:
                </span>
                <div className="flex items-center gap-3 font-mono font-bold text-[11px]">
                  {Object.entries(player.inventory || {}).filter(([_, qty]) => qty > 0).length > 0 ? (
                    Object.entries(player.inventory || {})
                      .filter(([_, qty]) => qty > 0)
                      .map(([potId, qty]) => {
                        const item = POTION_CATALOG.find((p) => p.id === potId);
                        return (
                          <span key={potId} className="flex items-center gap-1 text-amber-300">
                            <span>{item?.icon}</span>
                            <span>{item?.name.split(' ')[0]}: x{qty}</span>
                          </span>
                        );
                      })
                  ) : (
                    <span className="text-slate-500 italic">Inventory empty</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar: Next Round Action */}
          <div className="bg-slate-900/95 border-t-2 border-slate-700 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                All purchased items appear in your <strong>Potion Inventory</strong> below the player table during rounds.
              </span>
            </div>

            <button
              onClick={() => {
                sound.click();
                onNextRound();
              }}
              className="w-full sm:w-auto retro-button px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform shrink-0"
            >
              <span>Ready / Next Round</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
