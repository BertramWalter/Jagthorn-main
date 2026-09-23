import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CatalogPage } from './CatalogPage'

function renderCatalog() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <CatalogPage />
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  it('lists melodies from every category', () => {
    renderCatalog()
    expect(
      screen.getByRole('heading', { name: 'Jagthornsmelodier' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Jagt begynd/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Hallali/ })).toBeInTheDocument()
  })

  it('filters melodies by search query', async () => {
    const user = userEvent.setup()
    renderCatalog()
    const search = screen.getByLabelText('Søg efter melodi')
    await user.type(search, 'hallali')

    const list = screen.getByRole('list')
    expect(within(list).getByRole('link', { name: /Hallali/ })).toBeInTheDocument()
    expect(
      within(list).queryByRole('link', { name: /Jagt begynd/ }),
    ).not.toBeInTheDocument()
  })

  it('filters melodies by category', async () => {
    const user = userEvent.setup()
    renderCatalog()
    await user.click(
      screen.getByRole('button', { name: /Sølvprøven/ }),
    )
    const list = screen.getByRole('list')
    expect(within(list).getByRole('link', { name: /Hallali/ })).toBeInTheDocument()
    expect(
      within(list).queryByRole('link', { name: /Jagt begynd/ }),
    ).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    renderCatalog()
    await user.type(screen.getByLabelText('Søg efter melodi'), 'zzzznope')
    expect(screen.getByText(/Ingen melodier matcher/i)).toBeInTheDocument()
  })

  it('links to a shareable melody URL', () => {
    renderCatalog()
    const link = screen.getByRole('link', { name: /Jagt begynd/ })
    expect(link).toHaveAttribute('href', '/melodies/bronze-jagtbegynd')
  })
})
