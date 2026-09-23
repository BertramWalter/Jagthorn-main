import { describe, expect, it } from 'vitest'
import {
  getCategories,
  getMelodyById,
  melodies,
  totalCount,
} from './catalog'
import { isPlayable } from '../types/melody'

describe('melody catalog', () => {
  it('contains the migrated melodies', () => {
    expect(totalCount).toBeGreaterThan(80)
    expect(melodies).toHaveLength(totalCount)
  })

  it('has unique ids', () => {
    const ids = new Set(melodies.map((m) => m.id))
    expect(ids.size).toBe(melodies.length)
  })

  it('every melody is playable (has audio or video)', () => {
    const notPlayable = melodies.filter((m) => !isPlayable(m))
    expect(notPlayable).toEqual([])
  })

  it('looks up a melody by id', () => {
    const melody = getMelodyById('bronze-jagtbegynd')
    expect(melody?.title).toBe('Jagt begynd')
    expect(melody?.audioSrc).toBeDefined()
    expect(getMelodyById('does-not-exist')).toBeUndefined()
  })

  it('covers every main category with counts', () => {
    const categories = getCategories()
    const names = categories.map((c) => c.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'Bronzeprøven',
        'Sølvprøven',
        'Guldprøven',
        'Dulighedsprøve',
        'Andre',
        'DM/FM',
      ]),
    )
    const sum = categories.reduce((acc, c) => acc + c.count, 0)
    expect(sum).toBe(totalCount)
  })
})
