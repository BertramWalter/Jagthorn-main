import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="catalog">
      <div className="state" role="alert">
        <span className="state__icon" aria-hidden="true">
          🧭
        </span>
        Siden blev ikke fundet.
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link className="back-link" to="/">
          ← Tilbage til oversigten
        </Link>
      </p>
    </section>
  )
}
