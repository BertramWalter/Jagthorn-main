import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMediaPlayer } from './useMediaPlayer'

function setup() {
  const el = document.createElement('audio')
  document.body.appendChild(el)
  const ref = { current: el as HTMLMediaElement }
  const view = renderHook(
    ({ key }: { key: string }) => useMediaPlayer(ref, key),
    { initialProps: { key: 'melody-a' } },
  )
  // Simulate metadata being available.
  act(() => {
    ;(el as unknown as { duration: number }).duration = 100
    el.dispatchEvent(new Event('loadedmetadata'))
  })
  return { el, ...view }
}

describe('useMediaPlayer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('reports duration once metadata loads', () => {
    const { result } = setup()
    expect(result.current.duration).toBe(100)
    expect(result.current.status).toBe('ready')
  })

  it('plays and pauses', () => {
    const { result } = setup()
    act(() => result.current.play())
    expect(result.current.isPlaying).toBe(true)
    act(() => result.current.pause())
    expect(result.current.isPlaying).toBe(false)
  })

  it('stops by pausing and resetting to the start', () => {
    const { el, result } = setup()
    act(() => {
      el.currentTime = 42
      el.dispatchEvent(new Event('timeupdate'))
    })
    expect(result.current.currentTime).toBe(42)
    act(() => result.current.stop())
    expect(result.current.currentTime).toBe(0)
    expect(result.current.isPlaying).toBe(false)
  })

  it('changes the playback rate', () => {
    const { el, result } = setup()
    act(() => result.current.setPlaybackRate(1.5))
    expect(result.current.playbackRate).toBe(1.5)
    expect(el.playbackRate).toBe(1.5)
  })

  it('sets volume and toggles mute', () => {
    const { el, result } = setup()
    act(() => result.current.setVolume(0.3))
    expect(result.current.volume).toBeCloseTo(0.3)
    act(() => result.current.toggleMute())
    expect(result.current.isMuted).toBe(true)
    expect(el.muted).toBe(true)
  })

  it('loops back to the loop start when the end is reached', () => {
    const { el, result } = setup()
    act(() => {
      result.current.setLoopEnabled(true)
      result.current.setLoopStart(2)
      result.current.setLoopEnd(10)
    })
    act(() => {
      el.currentTime = 10
      el.dispatchEvent(new Event('timeupdate'))
    })
    expect(result.current.currentTime).toBe(2)
    expect(result.current.isPlaying).toBe(true)
  })

  it('pauses at the loop end when looping is disabled', () => {
    const { el, result } = setup()
    act(() => {
      result.current.setLoopEnd(10)
    })
    act(() => {
      el.currentTime = 10
      el.dispatchEvent(new Event('timeupdate'))
    })
    expect(result.current.currentTime).toBe(0)
    expect(result.current.isPlaying).toBe(false)
  })

  it('restarts on ended when looping is enabled', () => {
    const { el, result } = setup()
    act(() => result.current.setLoopEnabled(true))
    act(() => {
      el.currentTime = 100
      el.dispatchEvent(new Event('ended'))
    })
    expect(result.current.currentTime).toBe(0)
    expect(result.current.isPlaying).toBe(true)
  })

  it('surfaces a friendly error on media failure', () => {
    const { el, result } = setup()
    act(() => {
      el.dispatchEvent(new Event('error'))
    })
    expect(result.current.status).toBe('error')
    expect(result.current.error).toMatch(/kunne ikke/i)
  })

  it('resets transient state when the source changes', () => {
    const { el, result, rerender } = setup()
    act(() => {
      result.current.setPlaybackRate(1.5)
      result.current.setLoopEnabled(true)
    })
    expect(result.current.playbackRate).toBe(1.5)

    act(() => {
      rerender({ key: 'melody-b' })
    })
    expect(result.current.playbackRate).toBe(1)
    expect(result.current.loop.enabled).toBe(false)
    expect(result.current.duration).toBe(0)
    expect(el.playbackRate).toBe(1)
  })
})
