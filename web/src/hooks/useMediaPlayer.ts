import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  loopActionOnEnded,
  loopActionOnTimeUpdate,
  type LoopSettings,
} from '../utils/loop'

export type PlayerStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'

export interface MediaPlayerState {
  status: PlayerStatus
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
  isMuted: boolean
  error: string | null
  loop: LoopSettings
}

export interface MediaPlayerControls {
  play: () => void
  pause: () => void
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setLoopEnabled: (enabled: boolean) => void
  setLoopStart: (start: number | null) => void
  setLoopEnd: (end: number | null) => void
}

export type UseMediaPlayerResult = MediaPlayerState & MediaPlayerControls

const DEFAULT_LOOP: LoopSettings = { enabled: false, start: null, end: null }

function messageForMediaError(el: HTMLMediaElement): string {
  // Numeric codes avoid depending on the `MediaError` global, which is not
  // available in every environment (e.g. jsdom during tests).
  switch (el.error?.code) {
    case 1: // MEDIA_ERR_ABORTED
      return 'Afspilningen blev afbrudt.'
    case 2: // MEDIA_ERR_NETWORK
      return 'Netværksfejl under indlæsning af mediet.'
    case 3: // MEDIA_ERR_DECODE
      return 'Mediet kunne ikke afkodes.'
    case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
      return 'Mediefilen kunne ikke findes eller understøttes ikke.'
    default:
      return 'Mediet kunne ikke afspilles.'
  }
}

/**
 * Attach player state and controls to a media element (audio or video).
 *
 * `srcKey` should change whenever the underlying source changes (a new
 * melody, or switching between the audio and video rendition) so that the
 * transient state — time, rate, loop — is reset cleanly.
 */
export function useMediaPlayer(
  mediaRef: RefObject<HTMLMediaElement | null>,
  srcKey: string,
): UseMediaPlayerResult {
  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRateState] = useState(1)
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loop, setLoop] = useState<LoopSettings>(DEFAULT_LOOP)

  // Keep loop readable from event handlers without re-subscribing.
  const loopRef = useRef<LoopSettings>(DEFAULT_LOOP)
  loopRef.current = loop

  const applyLoopAction = useCallback(
    (el: HTMLMediaElement, at: 'time' | 'ended') => {
      const action =
        at === 'time'
          ? loopActionOnTimeUpdate(el.currentTime, loopRef.current)
          : loopActionOnEnded(loopRef.current)
      if (!action) return
      el.currentTime = action.seekTo
      setCurrentTime(action.seekTo)
      if (action.play) {
        void el.play().catch(() => undefined)
      } else {
        el.pause()
      }
    },
    [],
  )

  // Wire up event listeners whenever the element or source changes.
  useEffect(() => {
    const el = mediaRef.current
    if (!el) return

    // Reset transient state for the new source.
    setStatus('loading')
    setError(null)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackRateState(1)
    setLoop(DEFAULT_LOOP)
    el.playbackRate = 1

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(el.duration) ? el.duration : 0)
      setStatus((s) => (s === 'error' ? s : 'ready'))
    }
    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime)
      applyLoopAction(el, 'time')
    }
    const onPlay = () => setStatus('playing')
    const onPause = () => setStatus((s) => (s === 'ended' ? s : 'paused'))
    const onEnded = () => {
      setStatus('ended')
      applyLoopAction(el, 'ended')
    }
    const onError = () => {
      setError(messageForMediaError(el))
      setStatus('error')
    }
    const onVolumeChange = () => {
      setVolumeState(el.volume)
      setIsMuted(el.muted)
    }
    const onRateChange = () => setPlaybackRateState(el.playbackRate)

    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', onError)
    el.addEventListener('volumechange', onVolumeChange)
    el.addEventListener('ratechange', onRateChange)

    // Metadata may already be loaded on remount.
    if (el.readyState >= 1) onLoadedMetadata()

    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', onError)
      el.removeEventListener('volumechange', onVolumeChange)
      el.removeEventListener('ratechange', onRateChange)
      // Never let one melody keep playing over another.
      el.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef, srcKey, applyLoopAction])

  const play = useCallback(() => {
    const el = mediaRef.current
    if (!el) return
    const result = el.play()
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        setError(
          'Browseren blokerede automatisk afspilning. Tryk på play igen.',
        )
      })
    }
  }, [mediaRef])

  const pause = useCallback(() => {
    mediaRef.current?.pause()
  }, [mediaRef])

  const togglePlay = useCallback(() => {
    const el = mediaRef.current
    if (!el) return
    if (el.paused) play()
    else el.pause()
  }, [mediaRef, play])

  const stop = useCallback(() => {
    const el = mediaRef.current
    if (!el) return
    el.pause()
    el.currentTime = 0
    setCurrentTime(0)
    setStatus('paused')
  }, [mediaRef])

  const seek = useCallback(
    (time: number) => {
      const el = mediaRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(time, el.duration || time))
      el.currentTime = clamped
      setCurrentTime(clamped)
    },
    [mediaRef],
  )

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const el = mediaRef.current
      if (!el) return
      el.playbackRate = rate
      setPlaybackRateState(rate)
    },
    [mediaRef],
  )

  const setVolume = useCallback(
    (value: number) => {
      const el = mediaRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(1, value))
      el.volume = clamped
      if (clamped > 0 && el.muted) el.muted = false
      setVolumeState(clamped)
    },
    [mediaRef],
  )

  const toggleMute = useCallback(() => {
    const el = mediaRef.current
    if (!el) return
    el.muted = !el.muted
    setIsMuted(el.muted)
  }, [mediaRef])

  const setLoopEnabled = useCallback(
    (enabled: boolean) => setLoop((l) => ({ ...l, enabled })),
    [],
  )
  const setLoopStart = useCallback(
    (start: number | null) => setLoop((l) => ({ ...l, start })),
    [],
  )
  const setLoopEnd = useCallback(
    (end: number | null) => setLoop((l) => ({ ...l, end })),
    [],
  )

  return {
    status,
    isPlaying: status === 'playing',
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    error,
    loop,
    play,
    pause,
    togglePlay,
    stop,
    seek,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setLoopEnabled,
    setLoopStart,
    setLoopEnd,
  }
}
