import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom does not implement media playback. Give every media element a small
// in-memory model so that the player logic can run without throwing.
type MediaSlot = {
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  playbackRate: number
  paused: boolean
}

const slots = new WeakMap<HTMLMediaElement, MediaSlot>()

function slot(el: HTMLMediaElement): MediaSlot {
  let value = slots.get(el)
  if (!value) {
    value = {
      currentTime: 0,
      duration: Number.NaN,
      volume: 1,
      muted: false,
      playbackRate: 1,
      paused: true,
    }
    slots.set(el, value)
  }
  return value
}

function accessor<K extends keyof MediaSlot>(prop: K) {
  Object.defineProperty(HTMLMediaElement.prototype, prop, {
    configurable: true,
    get(this: HTMLMediaElement) {
      return slot(this)[prop]
    },
    set(this: HTMLMediaElement, value: MediaSlot[K]) {
      slot(this)[prop] = value
    },
  })
}

accessor('currentTime')
accessor('duration')
accessor('volume')
accessor('muted')
accessor('playbackRate')

Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
  configurable: true,
  get(this: HTMLMediaElement) {
    return slot(this).paused
  },
})

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  writable: true,
  value(this: HTMLMediaElement) {
    slot(this).paused = false
    this.dispatchEvent(new Event('play'))
    return Promise.resolve()
  },
})

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  writable: true,
  value(this: HTMLMediaElement) {
    slot(this).paused = true
    this.dispatchEvent(new Event('pause'))
  },
})

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  writable: true,
  value: () => undefined,
})

afterEach(() => {
  cleanup()
})
