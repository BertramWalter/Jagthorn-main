import { Link, useParams } from 'react-router-dom'
import { getMelodyById, theoryPdfSrc } from '../data/catalog'
import { MediaPlayer } from '../components/MediaPlayer'
import { SheetMusic } from '../components/SheetMusic'

export function MelodyPage() {
  const { id = '' } = useParams()
  const melody = getMelodyById(id)

  if (!melody) {
    return (
      <section className="catalog">
        <Link className="back-link" to="/">
          ← Tilbage til oversigten
        </Link>
        <div className="state state--error" role="alert">
          <span className="state__icon" aria-hidden="true">
            🔍
          </span>
          Melodien “{id}” findes ikke. Den kan være flyttet eller stavet
          forkert.
        </div>
      </section>
    )
  }

  return (
    <article className="melody-detail">
      <Link className="back-link" to="/">
        ← Tilbage til oversigten
      </Link>

      <header className="melody-detail__header">
        <span className="melody-detail__category">{melody.category}</span>
        <h1 className="melody-detail__title">{melody.title}</h1>
        {melody.tags && melody.tags.length > 0 && (
          <div className="melody-detail__tags">
            {melody.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="melody-detail__layout">
        <section className="panel" aria-labelledby="notes-heading">
          <h2 className="panel__title" id="notes-heading">
            Noder
          </h2>
          <SheetMusic src={melody.sheetMusicSrc} title={melody.title} />
        </section>

        <section className="panel" aria-labelledby="player-heading">
          <h2 className="panel__title" id="player-heading">
            Afspiller
          </h2>
          {/* key forces a clean player (and stops audio) per melody */}
          <MediaPlayer key={melody.id} melody={melody} />

          {(melody.pdfSrc || theoryPdfSrc) && (
            <div className="resource-links">
              {melody.pdfSrc && (
                <a href={melody.pdfSrc} target="_blank" rel="noreferrer">
                  📄 Node-PDF
                </a>
              )}
              {theoryPdfSrc && (
                <a href={theoryPdfSrc} target="_blank" rel="noreferrer">
                  📘 Nodelære og blæseteknik
                </a>
              )}
            </div>
          )}
        </section>
      </div>
    </article>
  )
}
