import React from 'react';
import { EmojiReaction } from '../types';

export const REACTION_EMOJIS = ['🤨', '🚨', '🦎', '💀', '👏'];

interface FloatingReactionsProps {
  reactions: EmojiReaction[];
}

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions }) => (
  <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-live="polite">
    {reactions.map((reaction) => (
      <div
        key={reaction.id}
        className="floating-reaction absolute bottom-24 text-3xl drop-shadow-lg sm:text-4xl"
        style={{ left: `${12 + (reaction.id.charCodeAt(reaction.id.length - 1) % 76)}%` }}
        role="status"
        aria-label={`${reaction.playerName} reacted ${reaction.emoji}`}
      >
        {reaction.emoji}
      </div>
    ))}
  </div>
);

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onReact }) => (
  <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/90 p-1.5 shadow-lg" aria-label="Send a reaction">
    {REACTION_EMOJIS.map((emoji) => (
      <button
        key={emoji}
        type="button"
        onClick={() => onReact(emoji)}
        className="rounded-lg px-2 py-1 text-lg transition-transform hover:scale-125 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label={`React ${emoji}`}
      >
        {emoji}
      </button>
    ))}
  </div>
);
