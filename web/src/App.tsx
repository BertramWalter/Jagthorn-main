import { Link, Route, Routes } from 'react-router-dom'
import { CatalogPage } from './pages/CatalogPage'
import { MelodyPage } from './pages/MelodyPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Spring til indhold
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-header__brand" to="/">
            <span className="site-header__logo" aria-hidden="true">
              🎺
            </span>
            <span>
              <span className="site-header__title">Jagthorn</span>
              <p className="site-header__tagline">
                Melodier og signaler til jagthorn
              </p>
            </span>
          </Link>
        </div>
      </header>

      <main className="app__main" id="main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/melodies/:id" element={<MelodyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>
            Bygget på det åbne jagthorn-materiale ·{' '}
            <a
              href="https://github.com/bryne91/jagthorn"
              target="_blank"
              rel="noreferrer"
            >
              Kildeprojekt
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
