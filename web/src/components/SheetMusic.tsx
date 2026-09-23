import { useState } from 'react'

interface SheetMusicProps {
  src?: string
  title: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

export function SheetMusic({ src, title }: SheetMusicProps) {
  const [zoom, setZoom] = useState(1)
  const [failed, setFailed] = useState(false)

  if (!src) {
    return (
      <p className="sheet__fallback">
        Der findes ikke et selvstændigt nodebillede for denne melodi. Vælg
        video­visningen for at følge noderne.
      </p>
    )
  }

  if (failed) {
    return (
      <p className="sheet__fallback">
        Noderne kunne ikke indlæses. Prøv at{' '}
        <a href={src} target="_blank" rel="noreferrer">
          åbne billedet i en ny fane
        </a>
        .
      </p>
    )
  }

  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))

  return (
    <div className="sheet">
      <div className="sheet__frame">
        <img
          className="sheet__image"
          src={src}
          alt={`Noder til jagthornsmelodien ${title}`}
          loading="lazy"
          style={{ transform: `scale(${zoom})` }}
          onError={() => setFailed(true)}
        />
      </div>
      <div className="sheet__toolbar">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom ud"
        >
          −
        </button>
        <span className="sheet__zoom-label" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom ind"
        >
          +
        </button>
        <a
          className="btn btn--ghost"
          href={src}
          target="_blank"
          rel="noreferrer"
        >
          ⤢ Åbn i fuld størrelse
        </a>
        <a className="btn btn--ghost" href={src} download>
          ⬇ Hent billede
        </a>
      </div>
    </div>
  )
}
