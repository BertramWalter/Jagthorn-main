import { Link } from 'react-router-dom'
import type { Melody } from '../types/melody'
import { MelodyBadges } from './MelodyBadges'

export function MelodyCard({ melody }: { melody: Melody }) {
  return (
    <li>
      <Link
        className="melody-card"
        to={`/melodies/${melody.id}`}
        aria-label={`Åbn ${melody.title} (${melody.category})`}
      >
        <span className="melody-card__category">{melody.category}</span>
        <h2 className="melody-card__title">{melody.title}</h2>
        <MelodyBadges melody={melody} />
        {melody.tags && melody.tags.length > 0 && (
          <div className="melody-card__tags">
            {melody.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </li>
  )
}
