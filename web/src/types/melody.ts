export type MelodyCategory =
  | 'Bronzeprøven'
  | 'Sølvprøven'
  | 'Guldprøven'
  | 'Dulighedsprøve'
  | 'Andre'
  | 'DM/FM'

/**
 * A single hunting-horn melody and the assets that belong to it.
 *
 * All `*Src` fields are optional because the legacy material is uneven: some
 * melodies only have audio, some only video, and a few only sheet music.
 */
export type Melody = {
  /** Stable, URL-safe identifier used in routes (e.g. `bronze-jagtbegynd`). */
  id: string
  title: string
  category: MelodyCategory | string
  /** Original path from the legacy site, kept for traceability. */
  legacyPath: string
  description?: string
  /** MP3 audio track, if one exists. */
  audioSrc?: string
  /** Sheet-music image (PNG), shown in the notes viewer. */
  sheetMusicSrc?: string
  /** Video rendition (MP4) — for melodies that only exist as video. */
  videoMp4Src?: string
  /** Video rendition (WebM) used as an additional <source>. */
  videoWebmSrc?: string
  /** Per-melody PDF, when available. */
  pdfSrc?: string
  /** Free-form tags such as horn type or voice. */
  tags?: string[]
}

/** True when the melody can be played back as audio or video. */
export function isPlayable(melody: Melody): boolean {
  return Boolean(melody.audioSrc ?? melody.videoMp4Src ?? melody.videoWebmSrc)
}

/** True when the melody has a still sheet-music image. */
export function hasSheetMusic(melody: Melody): boolean {
  return Boolean(melody.sheetMusicSrc)
}

/** True when an MP3 audio track is available. */
export function hasAudio(melody: Melody): boolean {
  return Boolean(melody.audioSrc)
}

/** True when a video rendition (MP4/WebM) is available. */
export function hasVideo(melody: Melody): boolean {
  return Boolean(melody.videoMp4Src ?? melody.videoWebmSrc)
}
