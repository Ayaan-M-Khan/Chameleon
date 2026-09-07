import { Category, Player } from '../types';

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
  if (bot.role === 'innocent') {
    // Pick from the target word's clue bank
    const bank = category.clueBank[targetWord] || [targetWord.slice(0, 3)];
    // Filter out already submitted clues if possible
    const available = bank.filter(c => !existingClues.map(e => e.toLowerCase()).includes(c.toLowerCase()));
    const pool = available.length > 0 ? available : bank;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // The bot is the FOX!
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
      const candidateBank = (category.clueBank[guessedItem] || []).filter(c => c.toLowerCase() !== sampleClue);
      if (candidateBank.length > 0) {
        return candidateBank[Math.floor(Math.random() * candidateBank.length)];
      }
    }
  }

  // Fallback to category fox clue bank
  const foxBank = category.foxClueBank;
  const filtered = foxBank.filter(c => !existingClues.map(e => e.toLowerCase()).includes(c.toLowerCase()));
  const pool = filtered.length > 0 ? filtered : foxBank;
  return pool[Math.floor(Math.random() * pool.length)];
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
