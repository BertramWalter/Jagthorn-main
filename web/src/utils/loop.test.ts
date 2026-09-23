import { describe, expect, it } from 'vitest'
import {
  loopActionOnEnded,
  loopActionOnTimeUpdate,
  type LoopSettings,
} from './loop'

const off: LoopSettings = { enabled: false, start: null, end: null }

describe('loopActionOnTimeUpdate', () => {
  it('does nothing when no end time is set', () => {
    expect(loopActionOnTimeUpdate(5, off)).toBeNull()
    expect(loopActionOnTimeUpdate(5, { ...off, enabled: true })).toBeNull()
  })

  it('does nothing before the end time', () => {
    expect(
      loopActionOnTimeUpdate(4.9, { enabled: true, start: 2, end: 5 }),
    ).toBeNull()
  })

  it('loops back to start when end reached and loop enabled', () => {
    expect(
      loopActionOnTimeUpdate(5, { enabled: true, start: 2, end: 5 }),
    ).toEqual({ seekTo: 2, play: true })
  })

  it('loops back to 0 when no explicit start', () => {
    expect(
      loopActionOnTimeUpdate(5.1, { enabled: true, start: null, end: 5 }),
    ).toEqual({ seekTo: 0, play: true })
  })

  it('pauses at the end interval when loop disabled', () => {
    expect(
      loopActionOnTimeUpdate(5, { enabled: false, start: 2, end: 5 }),
    ).toEqual({ seekTo: 2, play: false })
  })
})

describe('loopActionOnEnded', () => {
  it('does nothing when loop disabled', () => {
    expect(loopActionOnEnded(off)).toBeNull()
  })

  it('restarts from start when loop enabled', () => {
    expect(loopActionOnEnded({ enabled: true, start: 3, end: null })).toEqual({
      seekTo: 3,
      play: true,
    })
  })

  it('restarts from 0 when no start set', () => {
    expect(loopActionOnEnded({ enabled: true, start: null, end: null })).toEqual(
      { seekTo: 0, play: true },
    )
  })
})
