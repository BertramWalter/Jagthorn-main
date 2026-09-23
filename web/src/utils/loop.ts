/** User-controlled loop settings. */
export type LoopSettings = {
  enabled: boolean
  /** Loop start in seconds, or null for "from the beginning". */
  start: number | null
  /** Loop end in seconds, or null for "until the end". */
  end: number | null
}

/** What the player should do next: seek somewhere and optionally keep playing. */
export type LoopAction = { seekTo: number; play: boolean } | null

function normalizedStart(loop: LoopSettings): number {
  return loop.start != null && loop.start > 0 ? loop.start : 0
}

/**
 * Decide what to do on every `timeupdate` while playing.
 *
 * When an end time is set and reached, we either loop back to the start
 * (loop enabled) or pause there (loop disabled).
 */
export function loopActionOnTimeUpdate(
  currentTime: number,
  loop: LoopSettings,
): LoopAction {
  if (loop.end == null || !(loop.end > 0)) return null
  if (currentTime < loop.end) return null
  return { seekTo: normalizedStart(loop), play: loop.enabled }
}

/**
 * Decide what to do when the media element fires `ended`.
 *
 * With loop enabled we jump back to the start and keep playing; otherwise we
 * do nothing and let playback stop.
 */
export function loopActionOnEnded(loop: LoopSettings): LoopAction {
  if (!loop.enabled) return null
  return { seekTo: normalizedStart(loop), play: true }
}
