import { describe, expect, it } from 'vitest'
import type { Melody } from '../types/melody'
import { ALL_CATEGORIES, filterMelodies, normalizeText } from './filter'

const melodies: Melody[] = [
  {
    id: 'bronze-jagtbegynd',
    title: 'Jagt begynd',
    category: 'Bronzeprøven',
    legacyPath: 'bronze/jagtbegynd',
    audioSrc: '/audio/mp3/bronze/jagtbegynd.mp3',
    tags: ['Fürst Pless'],
  },
  {
    id: 'solv-graevlingen',
    title: 'Hyldest til Grævlingen',
    category: 'Sølvprøven',
    legacyPath: 'solv/graevlingen',
    audioSrc: '/audio/mp3/solv/graevlingen.mp3',
    tags: ['Parforce', 'Stemme 1'],
  },
  {
    id: 'guld-gaasen',
    title: 'Gåsen',
    category: 'Guldprøven',
    legacyPath: 'guld/gaasen',
    audioSrc: '/audio/mp3/guld/gaasen.mp3',
  },
]

describe('normalizeText', () => {
  it('folds Danish letters and diacritics', () => {
    expect(normalizeText('Grævlingen')).toBe('graevlingen')
    expect(normalizeText('Gåsen')).toBe('gaasen')
    expect(normalizeText('SØLV')).toBe('soelv')
  })
})

describe('filterMelodies', () => {
  it('returns everything with no filter', () => {
    expect(filterMelodies(melodies)).toHaveLength(3)
    expect(
      filterMelodies(melodies, { query: '', category: ALL_CATEGORIES }),
    ).toHaveLength(3)
  })

  it('matches title case-insensitively', () => {
    const result = filterMelodies(melodies, { query: 'jagt' })
    expect(result.map((m) => m.id)).toEqual(['bronze-jagtbegynd'])
  })

  it('matches Danish characters regardless of spelling', () => {
    expect(filterMelodies(melodies, { query: 'grævling' })).toHaveLength(1)
    expect(filterMelodies(melodies, { query: 'graevling' })).toHaveLength(1)
    expect(filterMelodies(melodies, { query: 'gaasen' })).toHaveLength(1)
  })

  it('filters by category', () => {
    const result = filterMelodies(melodies, { category: 'Sølvprøven' })
    expect(result.map((m) => m.id)).toEqual(['solv-graevlingen'])
  })

  it('matches tags', () => {
    expect(filterMelodies(melodies, { query: 'parforce' })).toHaveLength(1)
  })

  it('combines all query tokens (AND)', () => {
    expect(
      filterMelodies(melodies, { query: 'hyldest grævling' }),
    ).toHaveLength(1)
    expect(filterMelodies(melodies, { query: 'hyldest gåsen' })).toHaveLength(0)
  })

  it('returns empty when nothing matches', () => {
    expect(filterMelodies(melodies, { query: 'findes-ikke' })).toHaveLength(0)
  })
})
