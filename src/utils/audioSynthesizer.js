/**
 * Web Audio Melodic Ambient Dream Synthesizer
 * Plays an ethereal, romantic, soothing acoustic chime / celesta music box melody.
 * Fallback when local MP3 audio is not yet provided, or plays concurrently as ambient tone.
 */
class DreamSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    this.gainNode = null;

    // Pentatonic & warm chords in C major / A minor (peaceful, heartfelt)
    // Notes in Hz: C4, D4, E4, G4, A4, C5, D5, E5, G5
    this.notes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99, 880.00
    ];

    // Lyrical birthday motif melody progression
    this.melodySequence = [
      { note: 261.63, duration: 0.6, delay: 0.4 }, // Happy
      { note: 261.63, duration: 0.4, delay: 0.4 }, // birth-
      { note: 293.66, duration: 0.8, delay: 0.7 }, // -day
      { note: 261.63, duration: 0.8, delay: 0.7 }, // to
      { note: 349.23, duration: 0.8, delay: 0.7 }, // you
      { note: 329.63, duration: 1.2, delay: 1.0 },

      { note: 261.63, duration: 0.6, delay: 0.4 }, // Happy
      { note: 261.63, duration: 0.4, delay: 0.4 }, // birth-
      { note: 293.66, duration: 0.8, delay: 0.7 }, // -day
      { note: 261.63, duration: 0.8, delay: 0.7 }, // to
      { note: 392.00, duration: 0.8, delay: 0.7 }, // you
      { note: 349.23, duration: 1.2, delay: 1.0 },

      { note: 261.63, duration: 0.6, delay: 0.4 }, // Happy
      { note: 261.63, duration: 0.4, delay: 0.4 }, // birth-
      { note: 523.25, duration: 0.8, delay: 0.7 }, // -day
      { note: 440.00, duration: 0.8, delay: 0.7 }, // dear
      { note: 349.23, duration: 0.8, delay: 0.7 }, // bestie
      { note: 329.63, duration: 0.8, delay: 0.7 },
      { note: 293.66, duration: 1.2, delay: 1.0 },

      { note: 466.16, duration: 0.6, delay: 0.4 }, // Happy
      { note: 466.16, duration: 0.4, delay: 0.4 }, // birth-
      { note: 440.00, duration: 0.8, delay: 0.7 }, // -day
      { note: 349.23, duration: 0.8, delay: 0.7 }, // to
      { note: 392.00, duration: 0.8, delay: 0.7 }, // you
      { note: 349.23, duration: 1.8, delay: 1.6 },
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(freq, duration = 1.0) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Soft sine + gentle triangle for warm music box sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now); // 1 octave overtone

      // Bell envelope (quick attack, gentle exponential decay)
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.3, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.4);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration + 0.5);
      oscHarmonic.stop(now + duration + 0.5);
    } catch (e) {
      console.warn("Audio chime play error:", e);
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;

    const currentNoteData = this.melodySequence[this.step % this.melodySequence.length];
    this.playChime(currentNoteData.note, currentNoteData.duration);

    // Warm subtle bass accompaniment every few notes
    if (this.step % 4 === 0) {
      this.playChime(currentNoteData.note / 2, 1.8);
    }

    this.step++;
    const nextDelay = currentNoteData.delay * 1000;
    this.timer = setTimeout(() => {
      this.scheduleNextNote();
    }, nextDelay);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setVolume(volume) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.15)), this.ctx.currentTime);
    }
  }
}

export const dreamSynth = new DreamSynthesizer();

