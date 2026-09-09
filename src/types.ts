export type PlayerRole = 'innocent' | 'fox';
export type BotPersonality = 'literal' | 'pop_culture' | 'abstract';

export interface LifetimeMatchStats {
  roundsPlayed: number;
  correctInfiltratorVotes: number;
  accusationVotesReceived: number;
  infiltratorRoundsWonWithoutAccusation: number;
  goldSpent: number;
}

export interface PotionItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  roleTarget: 'fox' | 'innocent' | 'all';
  icon: string;
}

export interface PlayerInventory {
  [potionId: string]: number;
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  isHost: boolean;
  avatar: string;
  score: number;
  gold?: number;
  inventory?: PlayerInventory;
  infiltratorBoostGold?: number;
  chameleonBoostGold?: number;
  isMuted?: boolean;
  role: PlayerRole;
  clue: string;
  hasSubmittedClue: boolean;
  votedForId: string | null;
  isReady: boolean;
  isReadyToLeaveShop?: boolean;
  personality?: BotPersonality;
  lifetimeStats?: LifetimeMatchStats;
  isDisconnected?: boolean;
  disconnectedAt?: number;
  sessionToken?: string;
}

export interface DiscussionMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  message: string;
  timestamp: number;
  isSilencedAttempt?: boolean;
}

export interface EmojiReaction {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  emoji: string;
  timestamp: number;
}

export interface Coordinate {
  col: 'A' | 'B' | 'C' | 'D';
  row: 1 | 2 | 3 | 4;
  colIndex: number; // 0..3
  rowIndex: number; // 0..3
  label: string;    // e.g. "C2"
  item: string;     // e.g. "Queen"
}

export interface Category {
  id: string;
  name: string;
  bannerColor: string;
  accentColor: string;
  description: string;
  // 16 items in row-major order: Row 1 (A1, B1, C1, D1), Row 2 (A2, B2, C2, D2)...
  items: string[];
  // Clue banks for simulated AI players per item
  clueBank: Record<string, string[]>;
  // Generic ambiguous / deceptive clues for the Fox
  foxClueBank: string[];
}

export interface GameSettings {
  pointForGuessingFox: boolean;      // 1 bonus point for guessing fox
  foxSeeOneClueEarly: boolean;       // Fox can peek 1 innocent clue before submitting
  anonymousVoting: boolean;          // Hide who voted for whom until reveal
  turnTimer: boolean;                // Turn timer toggle
  turnTimerSeconds: number;          // Default 60 (e.g. 30, 45, 60, 90, 120)
  privateGame: boolean;              // Private game toggle
  roomPassword?: string;             // Optional room passcode / password
  infiltratorCount: number;          // Number of infiltrators (1 or 2, default 1)
  chameleonCount?: number;           // Backwards-compat
  targetScore: number;               // Score to win game (default 5, 0 = Infinite / Endless)
  innocentCatchPoints: number;       // Points awarded to innocents when infiltrator caught (default 2)
  infiltratorEscapePoints: number;   // Points awarded to infiltrator if escaping undetected (default 2)
  chameleonEscapePoints?: number;
  infiltratorStealPoints: number;    // Points awarded to infiltrator if guessing word (default 1)
  chameleonStealPoints?: number;
  categoryDeckMode?: 'random' | 'select_one' | 'select_random'; // Category selection strategy
  categoryPool?: string[];           // Selected category IDs for select_random pool
  itemsEnabled?: boolean;            // Enable or disable in-game items, potion shop, and tactical power-ups (default true)
}

export type GameMode = 'solo' | 'pass_and_play' | 'room';

export type GamePhase =
  | 'home'
  | 'lobby'
  | 'clue_submission'
  | 'voting'
  | 'fox_guess'
  | 'round_resolution'
  | 'shop';

export interface RoundResolution {
  winner: 'innocents' | 'fox';
  reason: 'innocents_caught_fox' | 'fox_stole_win' | 'fox_escaped_undetected' | 'fox_won_sudden_death';
  foxPlayerId: string;
  foxPlayerName: string;
  accusedPlayerId: string | null;
  accusedPlayerName: string | null;
  targetWord: string;
  targetCoordinate: string;
  foxGuessWord?: string;
  foxGuessCoordinate?: string;
  voteTally: Record<string, number>;
  pointsAwarded: Record<string, { points: number; explanation: string }>;
  accolades?: Record<string, string[]>;
  isMatchComplete?: boolean;
}
