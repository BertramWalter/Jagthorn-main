import { describe, expect, it } from 'vitest'
import { resolveAssetUrl } from './asset'

// import.meta.env.BASE_URL always ends with a trailing slash.
const base = import.meta.env.BASE_URL

describe('resolveAssetUrl', () => {
  it('prefixes root-absolute asset paths with the base URL', () => {
    expect(resolveAssetUrl('/audio/mp3/bronze/jagtbegynd.mp3')).toBe(
      `${base}audio/mp3/bronze/jagtbegynd.mp3`,
    )
  })

  it('prefixes paths without a leading slash', () => {
    expect(resolveAssetUrl('audio/image/bronze/jagtbegynd.png')).toBe(
      `${base}audio/image/bronze/jagtbegynd.png`,
    )
  })

  it('leaves absolute URLs untouched', () => {
    expect(resolveAssetUrl('https://example.com/a.png')).toBe(
      'https://example.com/a.png',
    )
    expect(resolveAssetUrl('data:image/png;base64,AAAA')).toBe(
      'data:image/png;base64,AAAA',
    )
  })

  it('passes undefined through', () => {
    expect(resolveAssetUrl(undefined)).toBeUndefined()
  })
})
