import type { Melody } from '../types/melody'
import {
  melodies as generatedMelodies,
  categoryOrder,
  theoryPdfSrc as generatedTheoryPdfSrc,
} from './melodies.generated'
import { resolveAssetUrl } from '../utils/asset'

// The generated catalog stores root-absolute asset paths. Resolve them against
// the app base URL so audio, sheet music, video and PDFs load under the GitHub
// Pages sub-path (`/Jagthorn-main/`) as well as locally.
export const melodies: Melody[] = generatedMelodies.map((melody) => ({
  ...melody,
  audioSrc: resolveAssetUrl(melody.audioSrc),
  sheetMusicSrc: resolveAssetUrl(melody.sheetMusicSrc),
  videoMp4Src: resolveAssetUrl(melody.videoMp4Src),
  videoWebmSrc: resolveAssetUrl(melody.videoWebmSrc),
  pdfSrc: resolveAssetUrl(melody.pdfSrc),
}))

export const theoryPdfSrc = resolveAssetUrl(generatedTheoryPdfSrc)
export { categoryOrder }

const byId = new Map(melodies.map((m) => [m.id, m]))

/** Look up a single melody by its stable id. */
export function getMelodyById(id: string): Melody | undefined {
  return byId.get(id)
}

export type CategorySummary = { name: string; count: number }

/** Categories present in the catalog with their melody counts, in a fixed order. */
export function getCategories(): CategorySummary[] {
  const counts = new Map<string, number>()
  for (const m of melodies) {
    counts.set(m.category, (counts.get(m.category) ?? 0) + 1)
  }
  const ordered: CategorySummary[] = []
  for (const name of categoryOrder) {
    if (counts.has(name)) {
      ordered.push({ name, count: counts.get(name)! })
      counts.delete(name)
    }
  }
  // Any categories not covered by the fixed order are appended alphabetically.
  for (const [name, count] of [...counts.entries()].sort()) {
    ordered.push({ name, count })
  }
  return ordered
}

export const totalCount = melodies.length
