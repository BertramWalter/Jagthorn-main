import { describe, expect, it } from 'vitest'
import { formatTime } from './format'

describe('formatTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(5)).toBe('0:05')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(600)).toBe('10:00')
  })

  it('formats long tracks as h:mm:ss', () => {
    expect(formatTime(3661)).toBe('1:01:01')
  })

  it('guards against invalid input', () => {
    expect(formatTime(Number.NaN)).toBe('0:00')
    expect(formatTime(-10)).toBe('0:00')
    expect(formatTime(Infinity)).toBe('0:00')
  })
})
