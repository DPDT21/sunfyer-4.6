/**
 * Minimalist Web Audio API sound synthesizer for Sunfyer
 * Synthesizes warm, elegant solar tones without external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSolarTone(
  type: 'listen_start' | 'listen_stop' | 'response_start' | 'click' | 'toggle' | 'interrupt' | 'auto_dispatch' | 'warp_chirp' | 'update_success' | 'research_pulse',
  volumeMultiplier: number = 1.0
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const vol = Math.max(0, Math.min(1, volumeMultiplier));
    if (vol <= 0.001) return;

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'update_success': {
        // Celebratory harmonic sequence: C5 -> E5 -> G5 -> C6
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12 * vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.56);
        break;
      }
      case 'research_pulse': {
        // Deep resonance sonar ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.18); // B5
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.10 * vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
        break;
      }
      case 'interrupt': {
        // High-tech cyber cut-off: fast downward frequency chirp (1400Hz -> 200Hz)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15 * vol, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
      case 'auto_dispatch': {
        // Futuristic quantum uplink burst: ascending arpeggio pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12); // E6
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12 * vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }
      case 'warp_chirp': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.08 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.095);
        break;
      }
      case 'listen_start': {
        // Crisp dual chime rising: 440Hz -> 659Hz (A4 to E5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12 * vol, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      case 'listen_stop': {
        // Soft descending release: 659Hz -> 440Hz
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 * vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.21);
        break;
      }
      case 'response_start': {
        // Warm golden bell: harmonic blend
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09 * vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
        break;
      }
      case 'click': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.04 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.055);
        break;
      }
      case 'toggle': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1050, now + 0.08);
        gain.gain.setValueAtTime(0.05 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
    }
  } catch {
    // AudioContext blocked or not allowed yet
  }
}
