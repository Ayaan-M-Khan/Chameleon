import { BotPersonality, Category, Player } from '../types';

const personalityFallbacks: Record<BotPersonality, string[]> = {
  literal: ['Direct match', 'Taxonomic clue', 'Common example'],
  pop_culture: ['Iconic scene', 'Famous reference', 'You have seen this'],
  abstract: ['A sideways connection', 'A poetic association', 'Think beyond the obvious'],
};

/**
 * AI Bot Clue Generation
 */
export function generateBotClue(
  bot: Player,
  category: Category,
  targetWord: string,
  existingClues: string[],
  foxCanSeeOneClueEarly: boolean
): string {
  const safeTarget = targetWord && targetWord.trim() !== '' ? targetWord.trim() : (category.items[0] || 'Target');
  const personality = bot.personality || (bot.isHuman ? 'literal' : 'abstract');

  if (bot.role === 'innocent') {
    // Pick from the target word's clue bank (case-insensitive lookup)
    const clueKeys = Object.keys(category.clueBank || {});
    const matchingKey = clueKeys.find(k => k.toLowerCase() === safeTarget.toLowerCase()) || safeTarget;
    const bank = category.clueBank[matchingKey] || [safeTarget.slice(0, Math.min(4, safeTarget.length))];

    // Filter out already submitted clues if possible
    const available = bank.filter(c => c && !existingClues.map(e => e.toLowerCase()).includes(c.toLowerCase()));
    const pool = available.length > 0 ? available : bank;
    const validPool = pool.filter(c => c && c.trim() !== '');

    if (validPool.length > 0) {
      const clue = validPool[Math.floor(Math.random() * validPool.length)].trim();
      if (personality === 'pop_culture' && !/mufasa|rock|song|movie|famous|iconic/i.test(clue)) {
        return `${clue} (iconic)`;
      }
      if (personality === 'abstract' && clue.length < 6) {
        return `${clue} spark`;
      }
      return clue;
    }
    return safeTarget;
  }

  // The bot is the FOX / Chameleon!
  // Fox does not know the secret word.
  // If fox sees an early clue or other clues exist:
  if ((foxCanSeeOneClueEarly || existingClues.length > 0) && existingClues.length > 0) {
    // Pick a random innocent clue already submitted
    const sampleClue = existingClues[Math.floor(Math.random() * existingClues.length)].toLowerCase();

    // Check if any board word's bank matches this clue
    const potentialWords = category.items.filter(item => {
      const bank = category.clueBank[item] || [];
      return bank.some(b => b.toLowerCase().includes(sampleClue) || sampleClue.includes(b.toLowerCase()));
    });

    if (potentialWords.length > 0) {
      const guessedItem = potentialWords[Math.floor(Math.random() * potentialWords.length)];
      const candidateBank = (category.clueBank[guessedItem] || []).filter(
        c => c && c.toLowerCase() !== sampleClue && !existingClues.map(e => e.toLowerCase()).includes(c.toLowerCase())
      );
      if (candidateBank.length > 0) {
        return formatPersonalityClue(candidateBank[Math.floor(Math.random() * candidateBank.length)], personality);
      }
    }
  }

  // Fallback to category fox clue bank
  const foxBank = (category.foxClueBank && category.foxClueBank.length > 0)
    ? category.foxClueBank
    : ['Sweat', 'Athlete', 'Speed', 'Victory', 'Coach'];
  const filtered = foxBank.filter(c => c && !existingClues.map(e => e.toLowerCase()).includes(c.toLowerCase()));
  const pool = filtered.length > 0 ? filtered : foxBank;
  const validPool = pool.filter(c => c && c.trim() !== '');
  if (validPool.length > 0) {
    return formatPersonalityClue(validPool[Math.floor(Math.random() * validPool.length)], personality);
  }

  return personalityFallbacks[personality][Math.floor(Math.random() * personalityFallbacks[personality].length)];
}

function formatPersonalityClue(clue: string, personality: BotPersonality): string {
  const trimmed = clue.trim();
  if (personality === 'literal') return trimmed;
  if (personality === 'pop_culture') return /mufasa|rock|song|movie|famous|iconic/i.test(trimmed) ? trimmed : `${trimmed} classic`;
  return trimmed.length < 6 ? `${trimmed} spark` : trimmed;
}

/**
 * AI Bot Voting Decision
 */
export function decideBotVote(
  voter: Player,
  allPlayers: Player[],
  category: Category,
  targetWord: string
): string {
  const eligibleTargets = allPlayers.filter(p => p.id !== voter.id && p.hasSubmittedClue);
  if (eligibleTargets.length === 0) return voter.id;

  if (voter.role === 'fox') {
    // Fox wants to deflect to any innocent player, preferably one with a short or obscure clue
    const innocents = eligibleTargets.filter(p => p.role === 'innocent');
    const pool = innocents.length > 0 ? innocents : eligibleTargets;
    // Bias towards non-voter
    return pool[Math.floor(Math.random() * pool.length)].id;
  }

  // Innocent bot evaluates suspicion of each player
  // Suspicion is higher if the clue:
  // 1. Appears in category fox clue bank
  // 2. Is NOT in the targetWord's clue bank
  // 3. Is vague or generic
  const scoredTargets = eligibleTargets.map(player => {
    let suspicion = 1; // base baseline
    const playerClue = player.clue.trim().toLowerCase();
    const correctClueBank = (category.clueBank[targetWord] || []).map(c => c.toLowerCase());
    const isExactMatchInBank = correctClueBank.includes(playerClue);
    const isInFoxBank = category.foxClueBank.map(c => c.toLowerCase()).includes(playerClue);

    if (isInFoxBank) {
      suspicion += 5;
    }
    if (!isExactMatchInBank) {
      suspicion += 3;
    }
    if (player.role === 'fox') {
      // Natural tell: AI fox slightly more likely to trigger suspicion
      suspicion += 2;
    }
    // Add small random noise so AI votes aren't 100% hivemind
    suspicion += Math.random() * 2.5;

    return { id: player.id, suspicion };
  });

  scoredTargets.sort((a, b) => b.suspicion - a.suspicion);
  return scoredTargets[0].id;
}

/**
 * Smart AI Fox Escape Guess
 * When Fox is caught, it examines all clues submitted by players and picks the most likely tile on the board
 */
export function botFoxGuessWord(
  category: Category,
  allClues: string[]
): string {
  const scores: Record<string, number> = {};
  category.items.forEach(item => {
    scores[item] = 1; // baseline
    const itemClues = (category.clueBank[item] || []).map(c => c.toLowerCase());

    allClues.forEach(clue => {
      const cLower = clue.trim().toLowerCase();
      if (itemClues.includes(cLower)) {
        scores[item] += 5;
      } else if (itemClues.some(ic => ic.includes(cLower) || cLower.includes(ic))) {
        scores[item] += 2;
      }
    });
  });

  let bestWord = category.items[0];
  let maxScore = -1;
  for (const item of category.items) {
    // slight jitter
    const finalScore = scores[item] + Math.random() * 0.5;
    if (finalScore > maxScore) {
      maxScore = finalScore;
      bestWord = item;
    }
  }
  return bestWord;
}
