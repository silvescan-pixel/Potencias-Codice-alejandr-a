/**
 * Web Audio API procedural Egyptian / Alexandrian Ambient Music Generator
 * Uses authentic Maqam Hijaz / Phrygian Dominant tuning (D - Eb - F# - G - A - Bb - C - D)
 * Features:
 * 1. Ancient temple drone (sub-bass, fifth, octave, and subtle harmonics)
 * 2. Authentic Middle Eastern / Egyptian frame drum rhythm (Dum - Tek - Tek - Dum - Tek)
 * 3. Plucked Oud (ancient lute) playing Maqam Hijaz melodies
 * 4. Mystical Nay (desert reed flute) with expressive vibrato and breath resonance
 */

type MusicStateListener = (isPlaying: boolean) => void;

class EgyptianMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private rhythmIntervalId: number | null = null;
  private oudIntervalId: number | null = null;
  private fluteIntervalId: number | null = null;
  private volume: number = 0.6;
  private listeners: Set<MusicStateListener> = new Set();

  // D Hijaz / Phrygian Dominant scale frequencies in Hz
  // D3, Eb3, F#3, G3, A3, Bb3, C4, D4, Eb4, F#4, G4, A4
  private scaleFreqs = [
    146.83, 155.56, 185.00, 196.00, 220.00, 233.08, 
    261.63, 293.66, 311.13, 369.99, 392.00, 440.00
  ];

  public subscribe(listener: MusicStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isPlaying));
  }

  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public async start(): Promise<boolean> {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.error('AudioContext resume error', e);
      }
    }

    if (this.isPlaying) return true;
    this.isPlaying = true;
    this.notify();

    const now = ctx.currentTime;

    // 1. Resonant Ancient Temple Drone (D2, A2, D3, F#3)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, now);
    this.droneGain.gain.linearRampToValueAtTime(0.22, now + 1.5);

    const droneNotes = [73.42, 110.0, 146.83, 185.00];
    this.droneOscs = [];
    droneNotes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : idx === 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240 + idx * 45, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.connect(filter);
      filter.connect(this.droneGain!);
      osc.start(now);
      this.droneOscs.push(osc);
    });

    this.droneGain.connect(this.masterGain);

    // 2. Ancient Egyptian Frame Drum / Darbuka Rhythm:
    // Pattern (Dum - Tek - Tek - Dum - Tek) in 4/4 Maqsum rhythm
    let drumStep = 0;
    const drumPattern = [
      'dum', 'rest', 'tek', 'rest',
      'tek', 'rest', 'dum', 'rest',
      'tek', 'rest', 'rest', 'rest'
    ];

    const playDrumHit = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const hit = drumPattern[drumStep % drumPattern.length];
      drumStep++;
      if (hit === 'rest') return;

      const t = this.ctx.currentTime;

      if (hit === 'dum') {
        // Deep bass pulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.38);
      } else if (hit === 'tek') {
        // Crisp high frame drum rim / riqq tap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(350, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.14);
      }
    };

    // 3. Plucked Oud / Ancient Lute Loop
    let step = 0;
    const oudMelody = [
      0, 2, 4, 7, 6, 4, 2, 1,
      0, 4, 7, 9, 7, 4, 2, 0,
      4, 7, 8, 7, 4, 2, 1, 0,
      7, 9, 10, 9, 7, 4, 2, 0
    ];

    const playOud = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const noteIdx = oudMelody[step % oudMelody.length];
      const freq = this.scaleFreqs[noteIdx] || 146.83;
      step++;

      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      oscSub.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      oscSub.frequency.setValueAtTime(freq * 0.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1700, time);
      filter.frequency.exponentialRampToValueAtTime(360, time + 0.5);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      oscSub.start(time);
      osc.stop(time + 0.85);
      oscSub.stop(time + 0.85);
    };

    // 4. Mystical Ney Flute breathy notes
    let fluteStep = 0;
    const fluteNotes = [7, 9, 10, 9, 7, 4, 6, 4, 2, 0];
    const playNey = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const noteIdx = fluteNotes[fluteStep % fluteNotes.length];
      const freq = this.scaleFreqs[noteIdx] || 293.66;
      fluteStep++;

      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 2, time);

      // Vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.2, time);
      lfoGain.gain.setValueAtTime(5, time);
      lfo.connect(osc.frequency);
      lfo.start(time);
      lfo.stop(time + 2.5);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 2, time);
      filter.Q.setValueAtTime(3.0, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 2.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 2.5);
    };

    // Timers
    this.rhythmIntervalId = window.setInterval(playDrumHit, 320); // 12-step rhythm
    this.oudIntervalId = window.setInterval(playOud, 640);
    this.fluteIntervalId = window.setInterval(playNey, 2800);

    return true;
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.ctx && this.masterGain && this.droneGain) {
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    }

    setTimeout(() => {
      this.droneOscs.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.droneOscs = [];
    }, 350);

    if (this.rhythmIntervalId) {
      clearInterval(this.rhythmIntervalId);
      this.rhythmIntervalId = null;
    }
    if (this.oudIntervalId) {
      clearInterval(this.oudIntervalId);
      this.oudIntervalId = null;
    }
    if (this.fluteIntervalId) {
      clearInterval(this.fluteIntervalId);
      this.fluteIntervalId = null;
    }

    this.isPlaying = false;
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const egyptianMusic = new EgyptianMusicEngine();
