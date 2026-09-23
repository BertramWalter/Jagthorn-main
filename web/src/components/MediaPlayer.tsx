import { useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Melody } from '../types/melody'
import { hasAudio, hasVideo } from '../types/melody'
import { useMediaPlayer } from '../hooks/useMediaPlayer'
import { formatTime } from '../utils/format'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5]

type Mode = 'audio' | 'video'

function initialMode(melody: Melody): Mode {
  return hasAudio(melody) ? 'audio' : 'video'
}

export function MediaPlayer({ melody }: { melody: Melody }) {
  const audioAvailable = hasAudio(melody)
  const videoAvailable = hasVideo(melody)
  const [mode, setMode] = useState<Mode>(() => initialMode(melody))

  const mediaRef = useRef<HTMLMediaElement | null>(null)
  const srcKey = `${melody.id}:${mode}`
  const player = useMediaPlayer(mediaRef, srcKey)

  const duration = player.duration
  const canSeek = duration > 0

  const loopStartLabel = useMemo(
    () => (player.loop.start ?? '').toString(),
    [player.loop.start],
  )
  const loopEndLabel = useMemo(
    () => (player.loop.end ?? '').toString(),
    [player.loop.end],
  )

  if (!audioAvailable && !videoAvailable) {
    return (
      <p className="player__error" role="status">
        Der er ingen lyd- eller videofil for denne melodi.
      </p>
    )
  }

  const parseNumber = (value: string): number | null => {
    if (value.trim() === '') return null
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null
  }

  return (
    <div className="player">
      {mode === 'video' ? (
        <video
          key={srcKey}
          ref={mediaRef as RefObject<HTMLVideoElement>}
          className="player__media player__media--video"
          playsInline
          preload="metadata"
        >
          {melody.videoWebmSrc && (
            <source src={melody.videoWebmSrc} type="video/webm" />
          )}
          {melody.videoMp4Src && (
            <source src={melody.videoMp4Src} type="video/mp4" />
          )}
        </video>
      ) : (
        <audio
          key={srcKey}
          ref={mediaRef as RefObject<HTMLAudioElement>}
          preload="metadata"
        >
          {melody.audioSrc && <source src={melody.audioSrc} type="audio/mpeg" />}
        </audio>
      )}

      {audioAvailable && videoAvailable && (
        <div
          className="mode-switch"
          role="group"
          aria-label="Vælg afspilningstype"
        >
          <button
            type="button"
            className="mode-switch__btn"
            aria-pressed={mode === 'audio'}
            onClick={() => setMode('audio')}
          >
            Lyd + noder
          </button>
          <button
            type="button"
            className="mode-switch__btn"
            aria-pressed={mode === 'video'}
            onClick={() => setMode('video')}
          >
            Video
          </button>
        </div>
      )}

      {player.error && (
        <p className="player__error" role="alert">
          {player.error}
        </p>
      )}

      <div className="player__progress">
        <span className="player__time" aria-hidden="true">
          {formatTime(player.currentTime)}
        </span>
        <input
          className="player__seek"
          type="range"
          min={0}
          max={canSeek ? duration : 0}
          step={0.1}
          value={Math.min(player.currentTime, duration || 0)}
          disabled={!canSeek}
          onChange={(event) => player.seek(Number(event.target.value))}
          aria-label="Søg i afspilningen"
          aria-valuetext={`${formatTime(player.currentTime)} af ${formatTime(duration)}`}
        />
        <span className="player__time" aria-hidden="true">
          {formatTime(duration)}
        </span>
      </div>

      <div className="player__transport">
        <button
          type="button"
          className="btn btn--primary"
          onClick={player.togglePlay}
          aria-label={player.isPlaying ? 'Pause' : 'Afspil'}
        >
          {player.isPlaying ? '⏸ Pause' : '▶ Afspil'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={player.stop}
          aria-label="Stop og gå til start"
        >
          ⏹ Stop
        </button>
      </div>

      <div className="player__controls">
        <div className="control-group">
          <span className="control-group__label" id="speed-label">
            Hastighed
          </span>
          <div
            className="speed-buttons"
            role="group"
            aria-labelledby="speed-label"
          >
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                type="button"
                className="speed-btn"
                aria-pressed={player.playbackRate === speed}
                onClick={() => player.setPlaybackRate(speed)}
              >
                {speed}×
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label className="control-group__label" htmlFor="volume">
            Lydstyrke
          </label>
          <div className="volume">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={player.toggleMute}
              aria-pressed={player.isMuted}
              aria-label={player.isMuted ? 'Slå lyd til' : 'Slå lyd fra'}
            >
              {player.isMuted || player.volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={player.isMuted ? 0 : player.volume}
              onChange={(event) => player.setVolume(Number(event.target.value))}
              aria-label="Lydstyrke"
            />
          </div>
        </div>

        <div className="control-group loop">
          <div className="loop__toggle">
            <input
              id="loop-enabled"
              type="checkbox"
              checked={player.loop.enabled}
              onChange={(event) => player.setLoopEnabled(event.target.checked)}
            />
            <label htmlFor="loop-enabled">Gentag (loop)</label>
          </div>
          <div className="loop__range">
            <div className="field">
              <label htmlFor="loop-start">Start (sek.)</label>
              <input
                id="loop-start"
                type="number"
                min={0}
                step={0.1}
                value={loopStartLabel}
                placeholder="0"
                onChange={(event) =>
                  player.setLoopStart(parseNumber(event.target.value))
                }
              />
              <button
                type="button"
                className="link-btn"
                onClick={() => player.setLoopStart(Number(player.currentTime.toFixed(1)))}
              >
                Sæt til nu
              </button>
            </div>
            <div className="field">
              <label htmlFor="loop-end">Slut (sek.)</label>
              <input
                id="loop-end"
                type="number"
                min={0}
                step={0.1}
                value={loopEndLabel}
                placeholder={duration ? duration.toFixed(1) : 'slut'}
                onChange={(event) =>
                  player.setLoopEnd(parseNumber(event.target.value))
                }
              />
              <button
                type="button"
                className="link-btn"
                onClick={() => player.setLoopEnd(Number(player.currentTime.toFixed(1)))}
              >
                Sæt til nu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
