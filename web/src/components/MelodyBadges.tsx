import type { Melody } from '../types/melody'
import { hasAudio, hasSheetMusic, hasVideo, isPlayable } from '../types/melody'

/**
 * Small badges showing which assets a melody has, so the availability of
 * notes and audio is clear at a glance.
 */
export function MelodyBadges({ melody }: { melody: Melody }) {
  const badges: { key: string; className: string; label: string }[] = []
  if (hasAudio(melody)) {
    badges.push({ key: 'audio', className: 'badge--audio', label: '♪ Lyd' })
  }
  if (hasVideo(melody)) {
    badges.push({ key: 'video', className: 'badge--video', label: '▶ Video' })
  }
  if (hasSheetMusic(melody)) {
    badges.push({ key: 'sheet', className: 'badge--sheet', label: '𝄞 Noder' })
  }
  if (!isPlayable(melody) && !hasSheetMusic(melody)) {
    badges.push({
      key: 'none',
      className: 'badge--none',
      label: 'Ingen medier',
    })
  }

  return (
    <div className="badges">
      {badges.map((badge) => (
        <span key={badge.key} className={`badge ${badge.className}`}>
          {badge.label}
        </span>
      ))}
    </div>
  )
}
