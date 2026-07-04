/** Fire-and-forget audio playback. Returns the element so callers can pause/cleanup. */
export function playSound(src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.play().catch(() => {});
  return audio;
}

/* ── Tiny WebAudio synths for UI sounds (no copyrighted assets) ── */

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, start: number, duration: number, volume: number, type: OscillatorType = "sine") {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** XP "critical stop"-style ding: two quick descending tones. */
export function playError() {
  tone(830, 0, 0.28, 0.18);
  tone(620, 0.09, 0.34, 0.18);
}

/** Explorer "start navigation"-style click. */
export function playClick() {
  tone(2400, 0, 0.04, 0.1, "square");
  tone(1200, 0.015, 0.05, 0.06, "square");
}

/** Tray balloon pop: soft two-note rise. */
export function playBalloon() {
  tone(520, 0, 0.12, 0.1);
  tone(780, 0.1, 0.18, 0.1);
}
