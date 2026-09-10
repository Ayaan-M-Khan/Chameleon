import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  ArrowRight,
  ShieldCheck,
  Check,
  ShoppingBag,
  Info,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Player, PotionItem, GameMode } from '../types';
import { POTION_CATALOG } from '../data/potions';
import { sound } from '../utils/sound';

interface ShopModalProps {
  isOpen: boolean;
  player: Player;
  players: Player[];
  onBuyPotion: (potionId: string, cost: number, targetPlayerId?: string) => void;
  onToggleConfirmLeave: (playerId: string, isReady: boolean) => void;
  onNextRound: () => void;
  roundNumber: number;
  isHost?: boolean;
  gameMode?: GameMode;
  myPlayerId?: string;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  player,
  players = [],
  onBuyPotion,
  onToggleConfirmLeave,
  onNextRound,
  roundNumber,
  isHost = true,
  gameMode = 'solo',
  myPlayerId,
}) => {
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);
  const [passAndPlayShopperId, setPassAndPlayShopperId] = useState<string>(player.id);
  const [departureCountdown, setDepartureCountdown] = useState<number | null>(null);

  // In Pass and Play mode, allow switching active shopper
  const currentShopper =
    gameMode === 'pass_and_play'
      ? players.find((p) => p.id === passAndPlayShopperId) || player
      : player;

  const currentGold = currentShopper.gold ?? 0;
  const isInfiltrator = currentShopper.role === 'fox';

  // Departure readiness calculations
  const totalPlayers = players.length;
  const readyPlayers = players.filter((p) => p.isReadyToLeaveShop);
  const readyCount = readyPlayers.length;
  const allPlayersReady = totalPlayers > 0 && readyCount === totalPlayers;
  const isCurrentShopperReady = Boolean(currentShopper.isReadyToLeaveShop);

  // Shop entrance uses audio only; round confetti must not bleed into this phase.
  useEffect(() => {
    if (isOpen) {
      sound.shopOpen();
      try {
        confetti.reset();
      } catch {}
    }
    return () => {
      try {
        confetti.reset();
      } catch {}
    };
  }, [isOpen]);

  // 2. Automated simulated shopping & readiness for AI bots
  useEffect(() => {
    if (!isOpen) return;
    const unreadyBots = players.filter((p) => !p.isHuman && !p.isReadyToLeaveShop);
    if (unreadyBots.length === 0) return;

    const timer = setTimeout(() => {
      unreadyBots.forEach((bot) => {
        onToggleConfirmLeave(bot.id, true);
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen, players, onToggleConfirmLeave]);

  // 3. Automated departure sequence when ALL players have confirmed leave
  useEffect(() => {
    if (!isOpen || !allPlayersReady) {
      setDepartureCountdown(null);
      return;
    }

    sound.shopDepart();
    setDepartureCountdown(2);

    const step1 = setTimeout(() => {
      setDepartureCountdown(1);
    }, 1000);

    const step2 = setTimeout(() => {
      onNextRound();
    }, 2200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
    };
  }, [isOpen, allPlayersReady, onNextRound]);

  const handleBuy = (item: PotionItem) => {
    if (currentGold < item.cost) return;
    sound.powerup();
    onBuyPotion(item.id, item.cost, currentShopper.id);
    setJustPurchasedId(item.id);
    setTimeout(() => {
      setJustPurchasedId(null);
    }, 900);
  };

  const handleToggleReady = () => {
    const nextState = !isCurrentShopperReady;
    sound.shopReady();
    onToggleConfirmLeave(currentShopper.id, nextState);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop with mystical purple/slate blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Modal Window with Grand Spring Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.84, y: 35, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative z-10 retro-card rounded-2xl w-full max-w-4xl bg-[#101726] border-2 border-amber-500/80 text-slate-100 shadow-2xl shadow-amber-950/60 my-auto overflow-hidden flex flex-col ring-4 ring-amber-500/20"
          >
            {/* Grand Entrance Announcement Banner */}
            <div className="bg-gradient-to-r from-purple-950/90 via-amber-950/90 to-purple-950/90 py-1.5 px-4 text-center border-b border-amber-500/30 flex items-center justify-center gap-2 text-xs font-display font-extrabold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>THE MYSTIC SHOP HAS OPENED • ROUND {roundNumber} MARKET</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            {/* Header Bar */}
            <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 px-5 sm:px-6 py-3.5 border-b-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl animate-bounce select-none" style={{ animationDuration: '2s' }}>
                  🧙‍♂️
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black tracking-wider uppercase text-amber-300 flex items-center gap-2 drop-shadow-sm">
                    <span>THE MYSTIC SHOP</span>
                    <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">
                      Round {roundNumber}
                    </span>
                  </h2>
                  <p className="text-[11px] text-amber-200/80 font-mono">
                    Spend your gold on tactical potions before Round {roundNumber + 1}!
                  </p>
                </div>
              </div>

              {/* Gold Counter Badge */}
              <div className="flex items-center gap-2 bg-amber-950/90 border border-amber-500/70 px-4 py-1.5 rounded-xl shadow-inner">
                <Coins className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80 block leading-tight">
                    {gameMode === 'pass_and_play' ? `${currentShopper.name}'s Gold` : 'Your Balance'}
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm sm:text-base leading-tight">
                    {currentGold}g Gold
                  </span>
                </div>
              </div>
            </div>

            {/* Pass-and-Play Shopper Switcher Tab (Only in Pass and Play mode) */}
            {gameMode === 'pass_and_play' && (
              <div className="bg-slate-900/90 px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                  Switch Shopper:
                </span>
                <div className="flex items-center gap-1.5">
                  {players.map((p) => {
                    const isSelected = p.id === currentShopper.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPassAndPlayShopperId(p.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span>{p.avatar}</span>
                        <span className="break-words [overflow-wrap:anywhere] max-w-[120px] text-left leading-tight">{p.name}</span>
                        {p.isReadyToLeaveShop && (
                          <span className="text-[10px] text-emerald-600 font-bold font-mono">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Departure Readiness Status Bar */}
            <div className="bg-slate-950/80 px-5 sm:px-6 py-2.5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-display font-extrabold uppercase tracking-wide text-slate-200">
                  Departure Readiness:
                </span>
                <span className="font-mono text-xs font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {readyCount} / {totalPlayers} Confirmed Leave
                </span>
              </div>

              {/* Player Readiness Chips */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {players.map((p) => {
                  const isReady = Boolean(p.isReadyToLeaveShop);
                  const isSelf = p.id === currentShopper.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                        isReady
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/70 shadow-xs'
                          : 'bg-slate-900/80 text-slate-400 border-slate-700'
                      } ${isSelf ? 'ring-1 ring-amber-400/60' : ''}`}
                    >
                      <span>{p.avatar}</span>
                      <span className="font-bold truncate max-w-[80px] sm:max-w-[100px]">
                        <span className="break-words [overflow-wrap:anywhere] max-w-[100px] leading-tight">{p.name} {isSelf ? '(You)' : ''}</span>
                      </span>
                      {isReady ? (
                        <span className="flex items-center text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-400 text-[10px] animate-pulse">
                          <Clock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body Content: Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 sm:p-6 overflow-y-auto max-h-[55vh]">
              {/* Left Column: Merchant Avatar & Quotes */}
              <div className="md:col-span-4 flex flex-col items-center justify-between p-4 rounded-xl bg-slate-900/90 border-2 border-slate-700/80 text-center space-y-4">
                <div className="space-y-2 pt-2">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-purple-900 to-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-5xl shadow-xl shadow-purple-950/60">
                      🧙‍♂️
                    </div>
                  </div>

                  <div className="font-display font-black text-lg text-amber-200 tracking-wide">
                    Mystic Merchant
                  </div>

                  <div className="relative bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 text-xs text-amber-100/90 font-medium italic">
                    <span className="text-amber-400 font-bold text-sm">“</span>
                    Stock up well! Once everyone confirms ready, we embark into Round {roundNumber + 1}!
                    <span className="text-amber-400 font-bold text-sm">”</span>
                  </div>
                </div>

                {/* Player Status In Store */}
                <div className="w-full bg-slate-950/90 p-3 rounded-xl border border-slate-700/80 text-left space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span>Customer:</span>
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <span>{currentShopper.avatar}</span> {currentShopper.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">Current Secret Role:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase border ${
                        isInfiltrator
                          ? 'bg-rose-950 text-yellow-300 border-rose-500'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      {isInfiltrator ? '🕵️ The Infiltrator' : '🎯 Innocent'}
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
                      const canAfford = currentGold >= item.cost;
                      const isPurchasable = canAfford;
                      const ownedCount = currentShopper.inventory?.[item.id] || 0;
                      const isRecent = justPurchasedId === item.id;
                      const isRoleCompatible =
                        item.roleTarget === 'all' ||
                        (item.roleTarget === 'fox' && isInfiltrator) ||
                        (item.roleTarget === 'innocent' && !isInfiltrator);

                      return (
                        <div
                          key={item.id}
                          className={`retro-card p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                            isRoleCompatible
                              ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400/80 shadow-md'
                              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 opacity-90'
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
                                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                    <span
                                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                        item.roleTarget === 'fox'
                                          ? 'text-rose-300 bg-rose-950/80 border-rose-700/60'
                                          : 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60'
                                      }`}
                                    >
                                      {item.roleTarget === 'fox' ? 'Infiltrator' : 'Innocent'}
                                    </span>
                                    {!isRoleCompatible ? (
                                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border bg-amber-950/80 text-amber-300 border-amber-600/60">
                                        Unavailable for {isInfiltrator ? 'Infiltrator' : 'Innocent'} in Rounds
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-600/60">
                                        Usable by You
                                      </span>
                                    )}
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
                            {!canAfford ? (
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

                {/* Current Potions Inventory summary */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                  <span className="font-mono text-[11px]">
                    🎒 {currentShopper.name}'s Potions:
                  </span>
                  <div className="flex items-center gap-3 font-mono font-bold text-[11px]">
                    {Object.entries(currentShopper.inventory || {}).filter(([_, qty]) => Number(qty) > 0).length > 0 ? (
                      Object.entries(currentShopper.inventory || {})
                        .filter(([_, qty]) => Number(qty) > 0)
                        .map(([potId, qty]) => {
                          const item = POTION_CATALOG.find((p) => p.id === potId);
                          return (
                            <span key={potId} className="flex items-center gap-1 text-amber-300">
                              <span>{item?.icon}</span>
                              <span>
                                {item?.name.split(' ')[0]}: x{qty}
                              </span>
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

            {/* Footer Bar: Everyone Has to Confirm Their Leave in Order to Leave Shop */}
            <div className="bg-slate-900/95 border-t-2 border-slate-700 px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 text-center sm:text-left">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  All players must confirm ready before departing to Round {roundNumber + 1}.
                </span>
              </div>

              {/* Action Buttons: Confirm Leave & Depart */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Active Player Toggle Ready to Leave Button */}
                <button
                  onClick={handleToggleReady}
                  className={`flex-1 sm:flex-none retro-button px-5 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                    isCurrentShopperReady
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 shadow-emerald-950/40'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-amber-300 shadow-amber-950/40 animate-pulse'
                  }`}
                >
                  {isCurrentShopperReady ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>✓ Ready to Leave (Click to Unready)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Confirm Leave Shop</span>
                    </>
                  )}
                </button>

                {/* Host Immediate Depart Button when all are ready or fallback */}
                {allPlayersReady && (
                  <button
                    onClick={() => {
                      sound.shopDepart();
                      onNextRound();
                    }}
                    className="flex-1 sm:flex-none retro-button px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer border-2 border-emerald-300 active:scale-95 animate-bounce"
                  >
                    <span>
                      Depart Shop Now {departureCountdown !== null ? `(${departureCountdown}s)` : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                )}
              </div>
            </div>

            {/* Animated Celebration Banner when All Players Confirmed */}
            {allPlayersReady && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500 text-slate-950 px-4 py-2 text-center font-display font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 border-t border-emerald-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>ALL PLAYERS CONFIRMED READY! DEPARTING TO ROUND {roundNumber + 1}...</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
