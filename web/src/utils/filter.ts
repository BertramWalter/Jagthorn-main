import type { Melody } from '../types/melody'

/**
 * Fold Danish letters and diacritics so that e.g. `grævling`, `graevling`
 * and `GRÆVLING` all match the same way.
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export type CatalogFilter = {
  query?: string
  category?: string
}

/** Represents "no category filter". */
export const ALL_CATEGORIES = 'Alle'

/**
 * Filter melodies by a free-text query and an optional category.
 *
 * The query is matched against title, category and tags. Empty queries and
 * the `Alle` category are treated as "no filter".
 */
export function filterMelodies(
  melodies: Melody[],
  { query = '', category = ALL_CATEGORIES }: CatalogFilter = {},
): Melody[] {
  const needle = normalizeText(query)
  const tokens = needle.split(/\s+/).filter(Boolean)

  return melodies.filter((melody) => {
    if (category !== ALL_CATEGORIES && melody.category !== category) {
      return false
    }
    if (tokens.length === 0) return true

    const haystack = normalizeText(
      [melody.title, melody.category, ...(melody.tags ?? [])].join(' '),
    )
    return tokens.every((token) => haystack.includes(token))
  })
}
