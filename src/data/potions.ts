import { PotionItem } from '../types';

export const POTION_CATALOG: PotionItem[] = [
  {
    id: 'oracle_serum',
    name: 'Oracle Serum',
    description: 'Prompts you to reveal either the secret Row (1-4) or Column (A-D). Highlights the target on the 4x4 matrix.',
    cost: 150,
    roleTarget: 'fox',
    icon: '🧪',
  },
  {
    id: 'grid_scrambler',
    name: 'Grid Scrambler',
    description: 'Randomly shuffles the coordinate positions of the 16 words on the board for this round to disorient The Infiltrator.',
    cost: 100,
    roleTarget: 'innocent',
    icon: '🌀',
  },
  {
    id: 'clue_lens',
    name: 'Clue Lens',
    description: 'Reveals a second player\'s submitted clue early during the clue phase to help craft the perfect disguise.',
    cost: 120,
    roleTarget: 'fox',
    icon: '👁️',
  },
  {
    id: 'vote_shield',
    name: 'Vote Shield',
    description: 'Deducts 1 vote against you during the voting tally in this round.',
    cost: 80,
    roleTarget: 'innocent',
    icon: '🛡️',
  },
  {
    id: 'ink_of_deceit',
    name: 'Ink of Deceit',
    description: 'Secretly rewrite another player\'s clue. The forged clue takes effect silently once voting begins!',
    cost: 130,
    roleTarget: 'fox',
    icon: '✒️',
  },
  {
    id: 'silence_curse',
    name: 'Elixir of Silence',
    description: 'Mute another player from speaking during discussion! Their clue stays visible on the board, but they are silenced.',
    cost: 110,
    roleTarget: 'fox',
    icon: '🤐',
  },
];
