/** Fire-and-forget audio playback. Returns the element so callers can pause/cleanup. */
export function playSound(src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.play().catch(() => {});
  return audio;
}
