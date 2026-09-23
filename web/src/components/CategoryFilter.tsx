import type { CategorySummary } from '../data/catalog'
import { ALL_CATEGORIES } from '../utils/filter'

interface CategoryFilterProps {
  categories: CategorySummary[]
  selected: string
  totalCount: number
  onSelect: (category: string) => void
}

export function CategoryFilter({
  categories,
  selected,
  totalCount,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className="filters"
      role="group"
      aria-label="Filtrér melodier efter kategori"
    >
      <button
        type="button"
        className="filter-chip"
        aria-pressed={selected === ALL_CATEGORIES}
        onClick={() => onSelect(ALL_CATEGORIES)}
      >
        Alle
        <span className="filter-chip__count">{totalCount}</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          type="button"
          className="filter-chip"
          aria-pressed={selected === category.name}
          onClick={() => onSelect(category.name)}
        >
          {category.name}
          <span className="filter-chip__count">{category.count}</span>
        </button>
      ))}
    </div>
  )
}
