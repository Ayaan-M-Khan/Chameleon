import React from 'react';
import { Accessibility, Check, Eye, Settings, Volume2, VolumeX, X } from 'lucide-react';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  volume: number;
  onChangeVolume: (volume: number) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  compactDisplay: boolean;
  onToggleCompactDisplay: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  volume,
  onChangeVolume,
  reducedMotion,
  onToggleReducedMotion,
  compactDisplay,
  onToggleCompactDisplay,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="retro-card rounded-2xl w-full max-w-lg bg-[#131B2E] border-2 border-slate-700 text-slate-100 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 border border-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase">Player Options</h3>
              <p className="text-xs text-slate-400">Personal audio, motion, and display preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close options"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <section className="p-4 rounded-xl border-2 border-slate-700 bg-slate-800/80">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                <div>
                  <h4 className="font-bold text-sm text-white">Sound effects</h4>
                  <p className="text-xs text-slate-400">Control clicks, timers, alerts, and celebrations.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleSound}
                className={`px-3 py-1 rounded text-xs font-mono font-black uppercase cursor-pointer ${
                  soundEnabled ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <label className="block mt-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Master volume</span>
                <span className="text-emerald-300">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => onChangeVolume(Number(event.target.value))}
                disabled={!soundEnabled}
                className="w-full accent-emerald-400 disabled:opacity-40"
                aria-label="Master volume"
              />
            </label>
          </section>

          <PreferenceToggle
            icon={<Accessibility className="w-5 h-5 text-cyan-400" />}
            title="Reduced motion"
            description="Limit decorative movement and particle effects."
            enabled={reducedMotion}
            onToggle={onToggleReducedMotion}
          />

          <PreferenceToggle
            icon={<Eye className="w-5 h-5 text-amber-400" />}
            title="Compact board display"
            description="Use tighter spacing to keep more of the board visible."
            enabled={compactDisplay}
            onToggle={onToggleCompactDisplay}
          />
        </div>

        <div className="mt-5 pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="retro-button px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-lg cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface PreferenceToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({ icon, title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-slate-700 bg-slate-800/80">
    <div className="flex items-center gap-2 min-w-0">
      {icon}
      <div className="min-w-0">
        <h4 className="font-bold text-sm text-white">{title}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`shrink-0 px-3 py-1 rounded text-xs font-mono font-black uppercase cursor-pointer ${
        enabled ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-700 text-slate-400 border border-slate-600'
      }`}
    >
      {enabled ? <Check className="w-3.5 h-3.5" /> : 'OFF'}
    </button>
  </div>
);
