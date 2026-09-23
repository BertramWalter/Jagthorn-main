import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, melodies, totalCount } from '../data/catalog'
import { ALL_CATEGORIES, filterMelodies } from '../utils/filter'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { MelodyCard } from '../components/MelodyCard'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('kategori') ?? ALL_CATEGORIES

  const categories = useMemo(() => getCategories(), [])
  const results = useMemo(
    () => filterMelodies(melodies, { query, category }),
    [query, category],
  )

  const updateParams = (next: { q?: string; kategori?: string }) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (next.q !== undefined) {
          if (next.q) params.set('q', next.q)
          else params.delete('q')
        }
        if (next.kategori !== undefined) {
          if (next.kategori && next.kategori !== ALL_CATEGORIES) {
            params.set('kategori', next.kategori)
          } else {
            params.delete('kategori')
          }
        }
        return params
      },
      { replace: true },
    )
  }

  return (
    <section className="catalog" aria-labelledby="catalog-heading">
      <div className="catalog__intro">
        <h1 id="catalog-heading">Jagthornsmelodier</h1>
        <p>
          Find, se og øv jagthornssignaler og -melodier. Vælg en melodi for at
          se noderne, afspille lyd eller video og øve i dit eget tempo.
        </p>
      </div>

      <div className="catalog__controls">
        <SearchBar
          value={query}
          onChange={(value) => updateParams({ q: value })}
          resultCount={results.length}
        />
        <CategoryFilter
          categories={categories}
          selected={category}
          totalCount={totalCount}
          onSelect={(value) => updateParams({ kategori: value })}
        />
      </div>

      <p className="catalog__meta" aria-live="polite">
        Viser {results.length} af {totalCount} melodier
        {category !== ALL_CATEGORIES ? ` i ${category}` : ''}
        {query ? ` for “${query}”` : ''}.
      </p>

      {results.length === 0 ? (
        <div className="state" role="status">
          <span className="state__icon" aria-hidden="true">
            🎯
          </span>
          Ingen melodier matcher din søgning. Prøv et andet søgeord eller en
          anden kategori.
        </div>
      ) : (
        <ul className="melody-grid">
          {results.map((melody) => (
            <MelodyCard key={melody.id} melody={melody} />
          ))}
        </ul>
      )}
    </section>
  )
}
