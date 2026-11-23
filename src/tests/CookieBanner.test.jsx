// src/tests/CookieBanner.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CookieBanner from '../pages/CookieBanner'

// 🔧 Mock de GA (doit matcher EXACTEMENT le chemin importé dans CookieBanner)
vi.mock('../utils/analytics', () => ({
  loadGoogleAnalytics: vi.fn(),
}))
import { loadGoogleAnalytics } from '../utils/analytics'

beforeEach(() => {
  // reset consent avant chaque test
  window.localStorage.clear()
  vi.clearAllMocks()
})

const renderBanner = () =>
  render(
    <MemoryRouter>
      <CookieBanner />
    </MemoryRouter>
  )

describe('CookieBanner', () => {
  it("affiche la bannière quand aucun consentement n'est présent", () => {
    renderBanner()
    expect(
      screen.getByText(/nous utilisons des cookies/i)
    ).toBeInTheDocument()
  })

  it("au clic sur 'Accepter' → cache la bannière, stocke 'true' et charge GA", () => {
    renderBanner()
    const acceptBtn = screen.getByRole('button', { name: /accepter/i })
    fireEvent.click(acceptBtn)

    // bannière disparue
    expect(
      screen.queryByText(/nous utilisons des cookies/i)
    ).not.toBeInTheDocument()

    // localStorage mis à jour
    expect(window.localStorage.getItem('cookie-consent')).toBe('true')

    // GA chargé
    expect(loadGoogleAnalytics).toHaveBeenCalledTimes(1)
  })

  it("au clic sur 'Refuser' → cache la bannière et stocke 'false'", () => {
    renderBanner()
    const declineBtn = screen.getByRole('button', { name: /refuser/i })
    fireEvent.click(declineBtn)

    expect(
      screen.queryByText(/nous utilisons des cookies/i)
    ).not.toBeInTheDocument()
    expect(window.localStorage.getItem('cookie-consent')).toBe('false')

    // Pas de GA
    expect(loadGoogleAnalytics).not.toHaveBeenCalled()
  })

  it("si le consentement est déjà 'true' → n'affiche pas la bannière et charge GA", () => {
    window.localStorage.setItem('cookie-consent', 'true')
    renderBanner()
    expect(
      screen.queryByText(/nous utilisons des cookies/i)
    ).not.toBeInTheDocument()
    expect(loadGoogleAnalytics).toHaveBeenCalledTimes(1)
  })
})
