import type { Melody } from '../types/melody'
import {
  melodies as generatedMelodies,
  categoryOrder,
  theoryPdfSrc,
} from './melodies.generated'

export const melodies: Melody[] = generatedMelodies
export { categoryOrder, theoryPdfSrc }

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
