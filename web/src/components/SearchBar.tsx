interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="search">
      <label className="visually-hidden" htmlFor="melody-search">
        Søg efter melodi
      </label>
      <span className="search__icon" aria-hidden="true">
        🔍
      </span>
      <input
        id="melody-search"
        className="search__input"
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Søg efter melodi, kategori eller stemme…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby="search-result-count"
      />
      <span id="search-result-count" className="visually-hidden" aria-live="polite">
        {resultCount} melodier fundet
      </span>
    </div>
  )
}
