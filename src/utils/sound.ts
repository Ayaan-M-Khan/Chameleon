/**
 * Web Audio sound synthesizers for retro board game experience
 */

class SoundFX {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public enabled: boolean = true;
  public volume: number = 0.7;
  private unlockListenersInstalled = false;

  constructor() {
    this.installUnlockListeners();
  }

  private installUnlockListeners() {
    if (typeof window === 'undefined' || this.unlockListenersInstalled) return;
    this.unlockListenersInstalled = true;
    const unlock = () => {
      this.unlock();
      if (this.ctx?.state === 'running') {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
        this.unlockListenersInstalled = false;
      }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  /** Resume the audio context from a user gesture (required by mobile browsers). */
  public unlock() {
    if (!this.enabled || typeof window === 'undefined') return;
    const ctx = this.getContext();
    if (ctx?.state === 'suspended') {
      void ctx.resume().catch(() => {
        // Browsers can reject resume until another user gesture.
      });
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {
        // Playback will be retried from the next user gesture.
      });
    }
    return this.ctx;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01);
    }
  }

  // Soft wooden click / tap
  click() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  }

  // Clue submitted bell / ding
  clueChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.09, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Suspenseful accusation chord
  accuse() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [180, 220, 277].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Victory Fanfare
  victory() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Fox Caught / Buzzer
  caught() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore audio errors
    }
  }

  // Turn timer tick
  tick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Ignore audio errors
    }
  }

  // Potion consume bubbling arpeggio
  potionDrink() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [330, 440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + idx * 0.045 + 0.12);

        gain.gain.setValueAtTime(0.08, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.15);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Powerup / grid scramble magical chime
  powerup() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.09, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.28);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Glitch / glass shatter sound effect for nullified Oracle effect
  glitchShatter() {
    this.shatter();
  }

  // Crystal / Oracle shatter sound effect
  shatter() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High-pitched crystal fracture bursts + dissonant descending pitch cluster
      [1800, 1420, 1100, 720, 480, 220].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);
        osc.frequency.exponentialRampToValueAtTime(80, now + idx * 0.025 + 0.32);

        gain.gain.setValueAtTime(0.18 / (idx + 1), now + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.025 + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.35);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Muffled silence curse sound effect
  silence() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignore audio errors
    }
  }

  // Metallic gold coin clink sound effect
  coin() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.18);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Voting Begins: dramatic tension chord with rising pitch
  voteStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Low suspense thud
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(70, now + 0.4);
      subGain.gain.setValueAtTime(0.18, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(this.masterGain || ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // Tension synth chord
      [220, 261.63, 329.63, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.08);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.35);

        gain.gain.setValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + 0.08);
        osc.stop(now + 0.55);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Voting cast / accusation stamp sound
  voteCast() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Stamp impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);

      // Follow-up metallic tick
      const tick = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tick.type = 'sine';
      tick.frequency.setValueAtTime(900, now + 0.05);
      tickGain.gain.setValueAtTime(0.08, now + 0.05);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      tick.connect(tickGain);
      tickGain.connect(this.masterGain || ctx.destination);
      tick.start(now + 0.05);
      tick.stop(now + 0.18);
    } catch {
      // Ignore audio errors
    }
  }

  // Voting end / Gavel strike
  voteEnd() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Double gavel strike
      [0, 0.16].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now + offset);
        osc.frequency.exponentialRampToValueAtTime(50, now + offset + 0.22);

        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.25);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Specialized Potion Activation SFX
  potionUse(potionId?: string) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      if (!potionId) {
        this.potionDrink();
        return;
      }
      if (potionId === 'oracle_serum') {
        // High ethereal shimmer
        [587.33, 880, 1174.66, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.09, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);
          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.3);
        });
      } else if (potionId === 'vote_shield') {
        // Metallic barrier clink + protective chime
        [350, 700, 1050].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } else if (potionId === 'clue_lens') {
        // Crystal focus ring
        [440, 659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.08, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else if (potionId === 'silence_curse') {
        this.silence();
      } else if (potionId === 'grid_scrambler') {
        this.powerup();
      } else {
        this.potionDrink();
      }
    } catch {
      // Ignore audio errors
    }
  }

  // Celebratory fanfare for Innocents Victory
  celebrateInnocents() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Majestic major chords: C - E - G - high C with brassy warmth
      const notes = [
        { f: 523.25, t: 0, d: 0.18 },
        { f: 659.25, t: 0.14, d: 0.18 },
        { f: 783.99, t: 0.28, d: 0.24 },
        { f: 1046.5, t: 0.44, d: 0.55 },
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Stealth Victory fanfare for Infiltrator Victory
  celebrateInfiltrator() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sneaky noir chord: D minor / mysterious arpeggio into bold resolution
      const notes = [
        { f: 293.66, t: 0, d: 0.2 },
        { f: 349.23, t: 0.12, d: 0.2 },
        { f: 440, t: 0.24, d: 0.24 },
        { f: 587.33, t: 0.38, d: 0.6 },
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.09, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Mystic Shop Open fanfare - ethereal magical bells & sparkles
  shopOpen() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Magical ascending pentatonic bells: C5 - E5 - G5 - A5 - C6
      const notes = [
        { f: 523.25, t: 0, d: 0.25 },
        { f: 659.25, t: 0.08, d: 0.25 },
        { f: 783.99, t: 0.16, d: 0.28 },
        { f: 880.0, t: 0.24, d: 0.32 },
        { f: 1046.5, t: 0.32, d: 0.6 },
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Shop Ready Confirmation chime
  shopReady() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Shop Departure Whoosh
  shopDepart() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audio errors
    }
  }
}

export const sound = new SoundFX();
