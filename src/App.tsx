/**
 * The Fox - Social Deduction Word Game
 * Based on "The Chameleon" board game mechanics
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES, BOT_NAMES, BOT_AVATARS } from './data/categories';
import {
  Category,
  Coordinate,
  GameMode,
  GamePhase,
  GameSettings,
  Player,
  RoundResolution,
} from './types';
import { generateBotClue, decideBotVote, botFoxGuessWord } from './utils/aiBot';
import { sound } from './utils/sound';

import { HeaderBar } from './components/HeaderBar';
import { motion, AnimatePresence } from 'motion/react';
import { LeftColumnTable } from './components/LeftColumnTable';
import { RightColumnGrid } from './components/RightColumnGrid';
import { ActionTray } from './components/ActionTray';
import { LobbyView } from './components/LobbyView';
import { OptionsModal } from './components/OptionsModal';
import { RulesModal } from './components/RulesModal';
import { FoxGuessModal } from './components/FoxGuessModal';
import { RoundResolutionModal } from './components/RoundResolutionModal';
import { PassAndPlayModal } from './components/PassAndPlayModal';
import { HomeView } from './components/HomeView';
import { parseInviteUrl } from './utils/inviteUrl';
import { socketClient } from './utils/socketClient';

// Helper to generate a friendly Room ID
function generateRoomId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const num = Math.floor(1000 + Math.random() * 9000);
  const letter = letters[Math.floor(Math.random() * letters.length)];
  return `CHAM-${num}${letter}`;
}

// Initial default settings matching prompt
const DEFAULT_SETTINGS: GameSettings = {
  pointForGuessingFox: true,
  foxSeeOneClueEarly: false,
  anonymousVoting: false,
  turnTimer: false,
  turnTimerSeconds: 60,
  privateGame: false,
  chameleonCount: 1,
  targetScore: 5,
  innocentCatchPoints: 2,
  chameleonEscapePoints: 2,
  chameleonStealPoints: 1,
  categoryDeckMode: 'random',
  categoryPool: CATEGORIES.map((c) => c.id),
};

// Initial default 4 players (1 human + 3 bots)
const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'You',
    isHuman: true,
    isHost: true,
    avatar: '🦊',
    score: 0,
    role: 'innocent',
    clue: '',
    hasSubmittedClue: false,
    votedForId: null,
    isReady: false,
  },
  {
    id: 'bot-1',
    name: 'Detective Hazel',
    isHuman: false,
    isHost: false,
    avatar: '🕵️‍♂️',
    score: 0,
    role: 'innocent',
    clue: '',
    hasSubmittedClue: false,
    votedForId: null,
    isReady: false,
  },
  {
    id: 'bot-2',
    name: 'Captain Sterling',
    isHuman: false,
    isHost: false,
    avatar: '🦉',
    score: 0,
    role: 'innocent',
    clue: '',
    hasSubmittedClue: false,
    votedForId: null,
    isReady: false,
  },
  {
    id: 'bot-3',
    name: 'Dr. Watson',
    isHuman: false,
    isHost: false,
    avatar: '🐱',
    score: 0,
    role: 'innocent',
    clue: '',
    hasSubmittedClue: false,
    votedForId: null,
    isReady: false,
  },
];

export default function App() {
  // Parse any invite link query or hash parameters on initial load
  const inviteInfo = useRef(parseInviteUrl()).current;

  // Player ID stored per browser session
  const myPlayerId = useRef<string>(
    typeof window !== 'undefined'
      ? (() => {
          const stored = sessionStorage.getItem('chameleon_player_id');
          if (stored) return stored;
          const gen = `p-${Math.random().toString(36).substring(2, 8)}`;
          sessionStorage.setItem('chameleon_player_id', gen);
          return gen;
        })()
      : 'player-1'
  ).current;

  // Room ID
  const [roomId, setRoomId] = useState<string>(() => {
    if (inviteInfo.roomId) return inviteInfo.roomId;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && (hash.startsWith('CHAM-') || hash.startsWith('FOX-'))) return hash;
    }
    return generateRoomId();
  });

  // Core Game State
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    if (inviteInfo.roomId) return 'room';
    return 'solo';
  });
  const [gamePhase, setGamePhase] = useState<GamePhase>(() => {
    if (inviteInfo.autoJoin && inviteInfo.roomId) return 'lobby';
    return 'home';
  });
  const [roundNumber, setRoundNumber] = useState(1);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('sports');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [secretCoordinate, setSecretCoordinate] = useState<Coordinate | null>(null);
  const [foxPlayerId, setFoxPlayerId] = useState<string>('');
  const [settings, setSettings] = useState<GameSettings>(() => ({
    ...DEFAULT_SETTINGS,
    roomPassword: inviteInfo.password || '',
  }));
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active inputs
  const [clueInput, setClueInput] = useState('');
  const [selectedVoteTargetId, setSelectedVoteTargetId] = useState<string | null>(null);
  const [selectedGuessWord, setSelectedGuessWord] = useState<string | null>(null);
  const [roundResolution, setRoundResolution] = useState<RoundResolution | null>(null);

  // Turn timer
  const [timeLeft, setTimeLeft] = useState(60);

  // Modals
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFoxGuessModalOpen, setIsFoxGuessModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  // Pass and play states
  const [passAndPlayIndex, setPassAndPlayIndex] = useState(0);
  const [isPassAndPlayModalOpen, setIsPassAndPlayModalOpen] = useState(false);

  // Multiplayer Broadcast channel
  const [peerCount, setPeerCount] = useState(0);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Active player is this client's player (or pass and play current turn)
  const myPlayer = players.find((p) => p.id === myPlayerId) || players[0] || INITIAL_PLAYERS[0];
  const activePlayer =
    gameMode === 'pass_and_play' && gamePhase === 'clue_submission'
      ? players[passAndPlayIndex] || myPlayer
      : myPlayer;

  const isHost =
    players.find((p) => p.id === myPlayerId)?.isHost ?? (players[0]?.id === myPlayerId);

  // Sync sound utility with state
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sync room in URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = roomId;
    }
  }, [roomId]);

  // Setup Realtime WebSocket and BroadcastChannel Sync
  useEffect(() => {
    const unsubscribe = socketClient.subscribe((event) => {
      if (event.type === 'ROOM_STATE_SYNC' && event.room) {
        if (event.room.players) setPlayers(event.room.players);
        if (event.room.settings) setSettings((prev) => ({ ...prev, ...event.room.settings }));
        if (event.room.gamePhase) setGamePhase(event.room.gamePhase);
        if (event.room.category) setCategory(event.room.category);
        if (event.room.secretCoordinate !== undefined) setSecretCoordinate(event.room.secretCoordinate);
        if (event.room.foxPlayerId !== undefined) setFoxPlayerId(event.room.foxPlayerId);
        if (event.room.roundResolution !== undefined) {
          setRoundResolution(event.room.roundResolution);
          if (event.room.roundResolution) setIsResolutionModalOpen(true);
        }
        if (event.room.roundNumber !== undefined) setRoundNumber(event.room.roundNumber);
      } else if (event.type === 'ROOM_SETTINGS_UPDATED' && event.settings) {
        setSettings((prev) => ({ ...prev, ...event.settings }));
      } else if ((event.type === 'PLAYER_JOINED' || event.type === 'PLAYER_LEFT') && event.room) {
        if (event.room.players) setPlayers(event.room.players);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Setup BroadcastChannel for Room Multiplayer fallback
  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(`fox_game_room_${roomId}`);
    broadcastChannelRef.current = channel;

    // Ping peers
    channel.postMessage({ type: 'PING' });

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'PING') {
        channel.postMessage({ type: 'PONG' });
        setPeerCount((prev) => Math.max(prev, 1));
      } else if (data.type === 'PONG') {
        setPeerCount((prev) => prev + 1);
      } else if (data.type === 'STATE_SYNC' && gameMode === 'room') {
        if (data.phase) setGamePhase(data.phase);
        if (data.players) setPlayers(data.players);
        if (data.category) setCategory(data.category);
        if (data.secretCoordinate) setSecretCoordinate(data.secretCoordinate);
        if (data.foxPlayerId) setFoxPlayerId(data.foxPlayerId);
        if (data.roundResolution) {
          setRoundResolution(data.roundResolution);
          setIsResolutionModalOpen(true);
        }
      }
    };

    return () => {
      channel.close();
    };
  }, [roomId, gameMode]);

  // Broadcast helper
  const broadcastState = useCallback((phase?: GamePhase, updatedPlayers?: Player[], res?: RoundResolution | null) => {
    if (gameMode !== 'room' || !broadcastChannelRef.current) return;
    broadcastChannelRef.current.postMessage({
      type: 'STATE_SYNC',
      phase: phase || gamePhase,
      players: updatedPlayers || players,
      category,
      secretCoordinate,
      foxPlayerId,
      roundResolution: res !== undefined ? res : roundResolution,
    });
  }, [gameMode, gamePhase, players, category, secretCoordinate, foxPlayerId, roundResolution]);

  // Turn timer effect
  useEffect(() => {
    if (!settings.turnTimer) return;
    if (gamePhase !== 'clue_submission' && gamePhase !== 'voting') return;

    setTimeLeft(settings.turnTimerSeconds || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired: auto-advance
          if (gamePhase === 'clue_submission') {
            autoSubmitCurrentClue();
          } else if (gamePhase === 'voting') {
            autoSubmitCurrentVote();
          }
          return 0;
        }
        if (prev <= 5 && soundEnabled) {
          sound.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, settings.turnTimer, settings.turnTimerSeconds, soundEnabled]);

  // Setup New Round
  const startNewRound = useCallback((keepScores = true) => {
    sound.click();

    // 1. Determine Category
    let chosenCat: Category;
    const mode = settings.categoryDeckMode || (selectedCategoryId === 'random' ? 'random' : 'select_one');

    if (mode === 'select_random') {
      const poolIds = (settings.categoryPool && settings.categoryPool.length > 0)
        ? settings.categoryPool
        : CATEGORIES.map((c) => c.id);
      const available = CATEGORIES.filter((c) => poolIds.includes(c.id));
      const pool = available.length > 0 ? available : CATEGORIES;
      chosenCat = pool[Math.floor(Math.random() * pool.length)];
    } else if (mode === 'random' || selectedCategoryId === 'random') {
      chosenCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    } else {
      chosenCat = CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
    }
    setCategory(chosenCat);

    // 2. Pick Random Coordinate: col (A-D) & row (1-4)
    const cols: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
    const rows: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
    const cIdx = Math.floor(Math.random() * 4);
    const rIdx = Math.floor(Math.random() * 4);
    const col = cols[cIdx];
    const row = rows[rIdx];
    const item = chosenCat.items[rIdx * 4 + cIdx];

    const coord: Coordinate = {
      col,
      row,
      colIndex: cIdx,
      rowIndex: rIdx,
      label: `${col}${row}`,
      item,
    };
    setSecretCoordinate(coord);

    // 3. Secretly assign FOX / Chameleon based on settings.chameleonCount
    const count = Math.min(settings.chameleonCount || 1, Math.max(1, Math.floor(players.length / 2)));
    const shuffledIndices = Array.from({ length: players.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    const foxIndices = new Set(shuffledIndices.slice(0, count));
    const assignedFoxId = players[shuffledIndices[0]]?.id || players[0].id;
    setFoxPlayerId(assignedFoxId);

    // Reset players for new round
    const updatedPlayers: Player[] = players.map((p, idx) => ({
      ...p,
      role: foxIndices.has(idx) ? 'fox' : 'innocent',
      clue: '',
      hasSubmittedClue: false,
      votedForId: null,
      isReady: false,
      score: keepScores ? p.score : 0,
    }));

    setPlayers(updatedPlayers);
    setClueInput('');
    setSelectedVoteTargetId(null);
    setSelectedGuessWord(null);
    setRoundResolution(null);
    setIsFoxGuessModalOpen(false);
    setIsResolutionModalOpen(false);

    if (gameMode === 'pass_and_play') {
      setPassAndPlayIndex(0);
      setIsPassAndPlayModalOpen(true);
    }

    setGamePhase('clue_submission');

    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, {
        gamePhase: 'clue_submission',
        players: updatedPlayers,
        category: chosenCat,
        secretCoordinate: coord,
        foxPlayerId: assignedFoxId,
        roundResolution: null,
      });
    }

    broadcastState('clue_submission', updatedPlayers, null);
  }, [selectedCategoryId, players, gameMode, settings.chameleonCount, settings.categoryDeckMode, settings.categoryPool, roomId, broadcastState]);

  // Handle Player Management in Lobby
  const handleAddBot = () => {
    if (players.length >= 8) return;
    sound.click();
    const usedNames = players.map((p) => p.name);
    const availableNames = BOT_NAMES.filter((n) => !usedNames.includes(n));
    const botName = availableNames[0] || `Bot ${players.length + 1}`;
    const botAvatar = BOT_AVATARS[players.length % BOT_AVATARS.length];

    const newBot: Player = {
      id: `bot-${Date.now()}`,
      name: botName,
      isHuman: false,
      isHost: false,
      avatar: botAvatar,
      score: 0,
      role: 'innocent',
      clue: '',
      hasSubmittedClue: false,
      votedForId: null,
      isReady: false,
    };
    const updated = [...players, newBot];
    setPlayers(updated);
    if (gameMode === 'room' && roomId) {
      socketClient.addBot(roomId, newBot);
      broadcastState(gamePhase, updated);
    }
  };

  const handleRemovePlayer = (id: string) => {
    sound.click();
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    if (gameMode === 'room' && roomId) {
      socketClient.removePlayer(roomId, id);
      broadcastState(gamePhase, updated);
    }
  };

  const handleUpdatePlayerName = (id: string, newName: string) => {
    const updated = players.map((p) => (p.id === id ? { ...p, name: newName } : p));
    setPlayers(updated);
    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, { players: updated });
    }
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (gameMode === 'room' && roomId) {
        socketClient.updateSettings(roomId, updated);
      }
      return updated;
    });
  };

  // Submit human player clue
  const handleSubmitClue = () => {
    if (!clueInput.trim()) return;
    sound.clueChime();

    const formattedClue = clueInput.trim();
    const currentActiveId = activePlayer.id;

    // Update player
    const updated = players.map((p) =>
      p.id === currentActiveId
        ? { ...p, clue: formattedClue, hasSubmittedClue: true, isReady: true }
        : p
    );
    setPlayers(updated);
    setClueInput('');

    // In Room mode, sync submitted clue immediately so other peers see it live
    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, { players: updated });
      broadcastState('clue_submission', updated);
    }

    // In Pass & Play mode: advance to next player or check if all done
    if (gameMode === 'pass_and_play') {
      const nextIdx = passAndPlayIndex + 1;
      const humanPlayers = updated.filter((p) => p.isHuman);
      if (nextIdx < humanPlayers.length) {
        setPassAndPlayIndex(nextIdx);
        setIsPassAndPlayModalOpen(true);
        return;
      }
    }

    // Strict requirement: MUST wait for everyone to input their clue before starting voting section!
    if (updated.every((p) => p.hasSubmittedClue)) {
      transitionToVoting(updated);
      return;
    }

    // If there are unsubmitted AI bots, trigger their clues
    const hasUnsubmittedBots = updated.some((p) => !p.isHuman && !p.hasSubmittedClue);
    if (hasUnsubmittedBots && (gameMode !== 'room' || isHost)) {
      processBotClues(updated);
    }
  };

  const autoSubmitCurrentClue = () => {
    // For anyone who hasn't submitted a clue yet, auto-assign
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.hasSubmittedClue) return p;
        const fallback = p.role === 'fox' ? 'Wild' : (secretCoordinate?.item || 'Hint');
        return { ...p, clue: fallback, hasSubmittedClue: true, isReady: true };
      });
      if (gameMode === 'room' && roomId) {
        socketClient.syncState(roomId, { players: updated });
        broadcastState('clue_submission', updated);
      }
      // Everyone has a clue now, transition to voting
      transitionToVoting(updated);
      return updated;
    });
  };

  // Simulate AI bots submitting clues
  const processBotClues = (currentPlayers: Player[]) => {
    const unsubmittedBots = currentPlayers.filter((p) => !p.isHuman && !p.hasSubmittedClue);

    if (unsubmittedBots.length === 0) {
      // Check if all players have submitted
      if (currentPlayers.every((p) => p.hasSubmittedClue)) {
        transitionToVoting(currentPlayers);
      }
      return;
    }

    // Stagger bot clues realistically
    let delay = 400;

    unsubmittedBots.forEach((bot, idx) => {
      setTimeout(() => {
        setPlayers((prev) => {
          const existingClues = prev
            .filter((p) => p.hasSubmittedClue)
            .map((p) => p.clue);

          const botClue = generateBotClue(
            bot,
            category,
            secretCoordinate?.item || '',
            existingClues,
            settings.foxSeeOneClueEarly
          );

          const nextPlayers = prev.map((p) =>
            p.id === bot.id
              ? { ...p, clue: botClue, hasSubmittedClue: true, isReady: true }
              : p
          );

          if (gameMode === 'room' && roomId) {
            socketClient.syncState(roomId, { players: nextPlayers });
            broadcastState('clue_submission', nextPlayers);
          }

          sound.click();

          // If last bot finished, check if EVERY player has now submitted their clue
          if (idx === unsubmittedBots.length - 1) {
            setTimeout(() => {
              setPlayers((latest) => {
                // Strict requirement: MUST wait for everyone to input their clue before starting voting section!
                if (latest.every((p) => p.hasSubmittedClue)) {
                  transitionToVoting(latest);
                }
                return latest;
              });
            }, 600);
          }

          return nextPlayers;
        });
      }, delay);
      delay += 550;
    });
  };

  // Transition from Clues to Voting Phase
  const transitionToVoting = (finalPlayers: Player[]) => {
    // Strict requirement: MUST wait for everyone to input their clue before starting voting section!
    if (!finalPlayers.every((p) => p.hasSubmittedClue)) {
      return;
    }
    sound.accuse();
    setGamePhase('voting');
    setSelectedVoteTargetId(null);

    if (gameMode === 'pass_and_play') {
      setPassAndPlayIndex(0);
      setIsPassAndPlayModalOpen(true);
    }

    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, {
        gamePhase: 'voting',
        players: finalPlayers,
      });
    }
    broadcastState('voting', finalPlayers);
  };

  // Human player submits vote
  const handleSubmitVote = () => {
    if (!selectedVoteTargetId) return;
    sound.click();

    const currentVoterId = activePlayer.id;
    const updated = players.map((p) =>
      p.id === currentVoterId ? { ...p, votedForId: selectedVoteTargetId } : p
    );
    setPlayers(updated);

    // In Room mode, sync vote immediately
    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, { players: updated });
      broadcastState('voting', updated);
    }

    // In Pass & Play mode: advance to next player or check if all done
    if (gameMode === 'pass_and_play') {
      const nextIdx = passAndPlayIndex + 1;
      const humanPlayers = updated.filter((p) => p.isHuman);
      if (nextIdx < humanPlayers.length) {
        setPassAndPlayIndex(nextIdx);
        setSelectedVoteTargetId(null);
        setIsPassAndPlayModalOpen(true);
        return;
      }
    }

    // Check if there are unsubmitted AI bots that need to vote
    const hasUnsubmittedBots = updated.some((p) => !p.isHuman && !p.votedForId);
    if (hasUnsubmittedBots && (gameMode !== 'room' || isHost)) {
      processBotVotes(updated);
      return;
    }

    // Strict requirement: MUST wait for everyone to put in their vote before showing results!
    if (updated.every((p) => Boolean(p.votedForId))) {
      setTimeout(() => {
        evaluateVotingTally(updated);
      }, 800);
    }
  };

  const autoSubmitCurrentVote = () => {
    // For anyone who hasn't voted yet, assign a vote to another random player
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.votedForId) return p;
        const candidates = prev.filter((cand) => cand.id !== p.id);
        const randomTarget = candidates[Math.floor(Math.random() * candidates.length)]?.id || prev[0].id;
        return { ...p, votedForId: randomTarget };
      });
      if (gameMode === 'room' && roomId) {
        socketClient.syncState(roomId, { players: updated });
        broadcastState('voting', updated);
      }
      // Everyone has voted now, evaluate tally
      setTimeout(() => {
        evaluateVotingTally(updated);
      }, 700);
      return updated;
    });
  };

  // Process AI Bot Votes with realistic deliberation stagger
  const processBotVotes = (currentPlayers: Player[]) => {
    const unvotedBots = currentPlayers.filter((p) => !p.isHuman && !p.votedForId);

    if (unvotedBots.length === 0) {
      // Check if everyone has voted
      if (currentPlayers.every((p) => Boolean(p.votedForId))) {
        setTimeout(() => {
          evaluateVotingTally(currentPlayers);
        }, 800);
      }
      return;
    }

    let delay = 450;
    unvotedBots.forEach((bot, idx) => {
      setTimeout(() => {
        setPlayers((prev) => {
          const voteId = decideBotVote(
            bot,
            prev,
            category,
            secretCoordinate?.item || ''
          );

          const nextPlayers = prev.map((p) =>
            p.id === bot.id ? { ...p, votedForId: voteId } : p
          );

          if (gameMode === 'room' && roomId) {
            socketClient.syncState(roomId, { players: nextPlayers });
            broadcastState('voting', nextPlayers);
          }

          sound.click();

          // Check if this was the last bot AND if everyone has voted
          if (idx === unvotedBots.length - 1) {
            setTimeout(() => {
              setPlayers((latest) => {
                // Strict requirement: MUST wait for everyone to put in their vote before showing results!
                if (latest.every((p) => Boolean(p.votedForId))) {
                  evaluateVotingTally(latest);
                }
                return latest;
              });
            }, 800);
          }

          return nextPlayers;
        });
      }, delay);
      delay += 500;
    });
  };

  // Evaluate votes and determine if Fox was caught
  const evaluateVotingTally = (votedPlayers: Player[]) => {
    // Strict requirement: MUST wait for everyone to put in their vote before showing results!
    if (!votedPlayers.every((p) => Boolean(p.votedForId))) {
      return;
    }
    const tally: Record<string, number> = {};
    votedPlayers.forEach((p) => {
      if (p.votedForId) {
        tally[p.votedForId] = (tally[p.votedForId] || 0) + 1;
      }
    });

    // Find player with highest votes
    let maxVotes = -1;
    let accusedId: string | null = null;
    let isTie = false;

    Object.entries(tally).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        accusedId = targetId;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    });

    const accusedPlayer = votedPlayers.find((p) => p.id === accusedId) || null;
    const actualFox = votedPlayers.find((p) => p.role === 'fox') || votedPlayers[0];
    const caughtFox = votedPlayers.find((p) => p.id === accusedId && p.role === 'fox') || actualFox;

    // If there's a tie, the Fox escapes undetected; otherwise if accused player has role 'fox', they were caught!
    const accusedIsFox = votedPlayers.some((p) => p.role === 'fox' && p.id === accusedId);
    const foxWasCaught = !isTie && accusedId !== null && accusedIsFox;

    if (foxWasCaught) {
      sound.caught();
      // Fox is caught! They get ONE chance to guess the secret word
      setGamePhase('fox_guess');
      setIsFoxGuessModalOpen(true);

      // If Fox is an AI bot, let AI bot guess automatically after brief suspense
      if (!caughtFox.isHuman) {
        setTimeout(() => {
          const allInnocentClues = votedPlayers
            .filter((p) => p.role === 'innocent')
            .map((p) => p.clue);

          const aiGuess = botFoxGuessWord(category, allInnocentClues);
          setSelectedGuessWord(aiGuess);

          setTimeout(() => {
            resolveRound(true, aiGuess, votedPlayers, tally, accusedPlayer, caughtFox);
          }, 1200);
        }, 1500);
      }
    } else {
      // Fox escaped undetected! Innocents voted for someone else or tied
      sound.victory();
      resolveRound(false, undefined, votedPlayers, tally, accusedPlayer, actualFox);
    }
  };

  // Fox submits escape guess
  const handleSubmitFoxGuess = () => {
    if (!selectedGuessWord) return;
    sound.click();
    setIsFoxGuessModalOpen(false);

    const actualFox = players.find((p) => p.role === 'fox') || players[0];
    const accusedPlayer = actualFox; // Fox was accused
    const tally: Record<string, number> = {};
    players.forEach((p) => {
      if (p.votedForId) tally[p.votedForId] = (tally[p.votedForId] || 0) + 1;
    });

    resolveRound(true, selectedGuessWord, players, tally, accusedPlayer, actualFox);
  };

  // Finalize Round Resolution & Scoring
  const resolveRound = (
    foxWasCaught: boolean,
    foxGuessWord: string | undefined,
    currentPlayers: Player[],
    tally: Record<string, number>,
    accusedPlayer: Player | null,
    actualFox: Player
  ) => {
    const targetWord = secretCoordinate?.item || '';
    const pointsAwarded: Record<string, { points: number; explanation: string }> = {};

    let winner: 'innocents' | 'fox';
    let reason: 'innocents_caught_fox' | 'fox_stole_win' | 'fox_escaped_undetected';

    const innocentCatchPts = settings.innocentCatchPoints || 2;
    const chameleonStealPts = settings.chameleonStealPoints || 1;
    const chameleonEscapePts = settings.chameleonEscapePoints || 2;

    if (foxWasCaught) {
      const isGuessCorrect =
        foxGuessWord?.trim().toLowerCase() === targetWord.trim().toLowerCase();

      if (isGuessCorrect) {
        // Fox steals the win
        winner = 'fox';
        reason = 'fox_stole_win';
        pointsAwarded[actualFox.id] = {
          points: chameleonStealPts,
          explanation: `Caught, but correctly guessed the secret word (+${chameleonStealPts} pts)!`,
        };
      } else {
        // Innocents win
        winner = 'innocents';
        reason = 'innocents_caught_fox';
        currentPlayers.forEach((p) => {
          if (p.role === 'innocent') {
            let pts = innocentCatchPts;
            let expl = `Chameleon caught (+${innocentCatchPts} pts)`;
            // Bonus 1 pt for guessing fox if setting enabled
            if (settings.pointForGuessingFox && p.votedForId === actualFox.id) {
              pts += 1;
              expl = `Chameleon caught (+${innocentCatchPts} pts) + Correct Chameleon vote bonus (+1 pt)`;
            }
            pointsAwarded[p.id] = { points: pts, explanation: expl };
          }
        });
      }
    } else {
      // Fox escapes undetected
      winner = 'fox';
      reason = 'fox_escaped_undetected';
      pointsAwarded[actualFox.id] = {
        points: chameleonEscapePts,
        explanation: `Escaped undetected by blending in (+${chameleonEscapePts} pts)!`,
      };
    }

    // Award bonus point for guessing fox to any innocents who did vote for fox even if fox won or escaped
    if (settings.pointForGuessingFox && !pointsAwarded[actualFox.id]?.explanation.includes('bonus')) {
      currentPlayers.forEach((p) => {
        if (p.role === 'innocent' && p.votedForId === actualFox.id && !pointsAwarded[p.id]) {
          pointsAwarded[p.id] = {
            points: 1,
            explanation: 'Correct Fox accusation bonus (+1 pt)',
          };
        }
      });
    }

    // Update cumulative scores
    const updatedPlayers = currentPlayers.map((p) => {
      const earned = pointsAwarded[p.id]?.points || 0;
      return { ...p, score: p.score + earned };
    });

    const resolution: RoundResolution = {
      winner,
      reason,
      foxPlayerId: actualFox.id,
      foxPlayerName: actualFox.name,
      accusedPlayerId: accusedPlayer?.id || null,
      accusedPlayerName: accusedPlayer?.name || null,
      targetWord,
      targetCoordinate: secretCoordinate?.label || '',
      foxGuessWord,
      voteTally: tally,
      pointsAwarded,
    };

    setPlayers(updatedPlayers);
    setRoundResolution(resolution);
    setGamePhase('round_resolution');
    setIsFoxGuessModalOpen(false);
    setIsResolutionModalOpen(true);

    if (winner === 'innocents') {
      sound.victory();
    } else {
      sound.caught();
    }

    if (gameMode === 'room' && roomId) {
      socketClient.syncState(roomId, {
        gamePhase: 'round_resolution',
        players: updatedPlayers,
        roundResolution: resolution,
      });
    }

    broadcastState('round_resolution', updatedPlayers, resolution);
  };

  // Next round trigger from resolution
  const handleNextRound = () => {
    setIsResolutionModalOpen(false);
    setRoundNumber((r) => r + 1);
    startNewRound(true);
  };

  // Create room handler from Homepage
  const handleCreateRoom = async (
    playerName: string,
    avatar: string,
    mode: GameMode,
    customRoomId?: string,
    password?: string
  ) => {
    sound.click();
    const newRoomId = (customRoomId || generateRoomId()).trim().toUpperCase();
    setRoomId(newRoomId);
    setGameMode(mode);
    if (password) {
      setSettings((prev) => ({ ...prev, roomPassword: password }));
    }

    const hostPlayer: Player = {
      id: myPlayerId,
      name: playerName || 'Player 1',
      avatar: avatar || '🦊',
      isHuman: true,
      isHost: true,
      score: 0,
      role: 'innocent',
      clue: '',
      hasSubmittedClue: false,
      votedForId: null,
      isReady: true,
    };

    if (mode === 'room') {
      // Room multiplayer: start with ONLY the host, no default AI bots!
      setPlayers([hostPlayer]);
      await socketClient.createRoom(newRoomId, hostPlayer, settings, mode, selectedCategoryId, password);
      socketClient.connect(newRoomId, hostPlayer, password);
    } else {
      // Solo / Pass & Play: populate bot companions
      setPlayers([
        hostPlayer,
        ...INITIAL_PLAYERS.slice(1),
      ]);
    }
    setGamePhase('lobby');
  };

  // Join room handler from Homepage
  const handleJoinRoom = async (
    targetRoomId: string,
    playerName: string,
    avatar: string,
    password?: string
  ) => {
    sound.click();
    const cleanRoomId = targetRoomId.trim().toUpperCase();
    setRoomId(cleanRoomId);
    setGameMode('room');
    if (password) {
      setSettings((prev) => ({ ...prev, roomPassword: password }));
    }

    const guestPlayer: Player = {
      id: myPlayerId,
      name: playerName || 'Guest',
      avatar: avatar || '🕵️',
      isHuman: true,
      isHost: false,
      score: 0,
      role: 'innocent',
      clue: '',
      hasSubmittedClue: false,
      votedForId: null,
      isReady: true,
    };

    // Join room on the server to get actual room players
    const result = await socketClient.joinRoom(cleanRoomId, guestPlayer, password);
    if (result && result.room && Array.isArray(result.room.players) && result.room.players.length > 0) {
      setPlayers(result.room.players);
      if (result.room.settings) setSettings((prev) => ({ ...prev, ...result.room.settings }));
      if (result.room.gamePhase) setGamePhase(result.room.gamePhase);
      if (result.room.selectedCategoryId) setSelectedCategoryId(result.room.selectedCategoryId);
      if (result.room.category) setCategory(result.room.category);
    } else {
      // If room was not on server yet, initialize with just the guest player (no bots)
      setPlayers([guestPlayer]);
    }

    socketClient.connect(cleanRoomId, guestPlayer, password);
    setGamePhase('lobby');
  };

  // Auto-join if user loaded via direct invite link with autoJoin flag
  useEffect(() => {
    if (inviteInfo.autoJoin && inviteInfo.roomId) {
      handleJoinRoom(inviteInfo.roomId, 'Player 2', '🕵️', inviteInfo.password);
    }
  }, []);

  // Leave room / return to homepage
  const handleLeaveRoom = () => {
    sound.click();
    if (gameMode === 'room' && roomId) {
      socketClient.leaveRoom(roomId, myPlayerId);
    }
    setGamePhase('home');
    setRoundNumber(1);
    setRoundResolution(null);
    setIsResolutionModalOpen(false);
    setIsFoxGuessModalOpen(false);
  };

  const actualFoxPlayer = players.find((p) => p.role === 'fox') || null;
  const isCurrentPlayerTheCaughtFox = activePlayer.role === 'fox';

  return (
    <div className="min-h-screen bg-dark-pattern flex flex-col selection:bg-emerald-500 selection:text-slate-950 pb-8 text-slate-100">
      {/* Header Bar */}
      <HeaderBar
        roomId={roomId}
        gameMode={gameMode}
        gamePhase={gamePhase}
        roundNumber={roundNumber}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenOptions={() => setIsOptionsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onLeaveRoom={handleLeaveRoom}
        peerCount={peerCount}
        roomPassword={settings.roomPassword}
        players={players}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col">
        <AnimatePresence mode="wait">
          {gamePhase === 'home' ? (
            /* HOMEPAGE VIEW */
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <HomeView
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                onOpenRules={() => setIsRulesOpen(true)}
                defaultRoomId={inviteInfo.roomId || roomId}
                initialPassword={inviteInfo.password || settings.roomPassword || ''}
                initialJoinTab={Boolean(inviteInfo.roomId && !inviteInfo.autoJoin)}
              />
            </motion.div>
          ) : gamePhase === 'lobby' ? (
            /* LOBBY VIEW */
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <LobbyView
                players={players}
                gameMode={gameMode}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => {
                  setSelectedCategoryId(id);
                  if (gameMode === 'room' && roomId) {
                    const cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
                    socketClient.syncState(roomId, { selectedCategoryId: id, category: cat });
                  }
                }}
                onAddBot={handleAddBot}
                onRemovePlayer={handleRemovePlayer}
                onUpdatePlayerName={handleUpdatePlayerName}
                onStartGame={() => startNewRound(false)}
                onOpenOptions={() => setIsOptionsOpen(true)}
                onOpenRules={() => setIsRulesOpen(true)}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                roomId={roomId}
                onLeaveRoom={handleLeaveRoom}
                isHost={isHost}
              />
            </motion.div>
          ) : (
            /* ACTIVE ARENA: TWO-COLUMN LAYOUT */
            <motion.div
              key="arena"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch">
                {/* LEFT COLUMN: Player & Clue Table (expanded to 7 cols on lg/xl for full clue visibility) */}
                <div className="lg:col-span-7 flex flex-col">
                  <LeftColumnTable
                    players={players}
                    activePlayerId={activePlayer.id}
                    gamePhase={gamePhase}
                    anonymousVoting={settings.anonymousVoting}
                    canVoteNow={gamePhase === 'voting' && !activePlayer.votedForId}
                    selectedVoteTargetId={selectedVoteTargetId}
                    onSelectVoteTarget={(targetId) => setSelectedVoteTargetId(targetId)}
                  />
                </div>

                {/* RIGHT COLUMN: 4x4 Grid Card & Banners (5 cols on lg/xl) */}
                <div className="lg:col-span-5 flex flex-col">
                  <RightColumnGrid
                    category={category}
                    role={activePlayer.role}
                    secretCoordinate={secretCoordinate}
                    gamePhase={gamePhase}
                    isFoxGuesser={gamePhase === 'fox_guess' && isCurrentPlayerTheCaughtFox}
                    onSelectWordGuess={(word) => setSelectedGuessWord(word)}
                    selectedGuessWord={selectedGuessWord}
                    isPassAndPlay={gameMode === 'pass_and_play'}
                  />
                </div>
              </div>

              {/* ACTION & VOTING TRAY (BOTTOM SECTION) */}
              <ActionTray
                gamePhase={gamePhase}
                activePlayer={activePlayer}
                players={players}
                settings={settings}
                timeLeft={timeLeft}
                clueInput={clueInput}
                onChangeClueInput={setClueInput}
                onSubmitClue={handleSubmitClue}
                selectedVoteTargetId={selectedVoteTargetId}
                onSelectVoteTarget={(id) => setSelectedVoteTargetId(id)}
                onSubmitVote={handleSubmitVote}
                hasCurrentPlayerVoted={Boolean(activePlayer.votedForId)}
                selectedGuessWord={selectedGuessWord}
                onSubmitFoxGuess={handleSubmitFoxGuess}
                isCurrentPlayerTheCaughtFox={isCurrentPlayerTheCaughtFox}
                caughtFoxPlayer={actualFoxPlayer}
                roundResolution={roundResolution}
                onNextRound={handleNextRound}
                onOpenResolutionModal={() => setIsResolutionModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* OPTIONS MODAL */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* RULES MODAL */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* FOX GUESS MODAL (For dramatic Fox escape turn with smooth fade & slide) */}
      <FoxGuessModal
        isOpen={isFoxGuessModalOpen}
        category={category}
        foxPlayerName={actualFoxPlayer?.name || 'The Chameleon'}
        isHumanFox={isCurrentPlayerTheCaughtFox}
        players={players}
        onSelectGuess={(word) => setSelectedGuessWord(word)}
        selectedGuessWord={selectedGuessWord}
        onSubmitGuess={handleSubmitFoxGuess}
      />

      {/* ROUND RESOLUTION MODAL (With smooth spring fade & slide animations) */}
      <RoundResolutionModal
        isOpen={isResolutionModalOpen}
        roundResolution={roundResolution}
        players={players}
        onNextRound={handleNextRound}
        onClose={() => setIsResolutionModalOpen(false)}
        roundNumber={roundNumber}
        targetScore={settings.targetScore}
      />

      {/* PASS & PLAY PRIVACY SCREEN */}
      <PassAndPlayModal
        isOpen={isPassAndPlayModalOpen && gameMode === 'pass_and_play'}
        player={players[passAndPlayIndex] || null}
        onConfirmReady={() => setIsPassAndPlayModalOpen(false)}
        gamePhase={gamePhase}
      />
    </div>
  );
}
