// src/tests/ProtectedRoute.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

// ⚙️ Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

// ⚙️ Simule la variable d'env pour l'URL API
vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://api.test' } } })

// ⚙️ On importe le composant à tester et un stub simple
import ProtectedRoute from '../ProtectedRouteWrapper' // ⬅️ VOIR NOTE PLUS BAS
const Dummy = () => <div data-testid="ok">OK</div>
const Login = () => <div>Login</div>

beforeEach(() => {
  // Reset localStorage & mocks
  localStorage.clear()
  vi.clearAllMocks()
})

/**
 * Helper: rend une route protégée dans un Router mémoire
 */
function renderWithRouter(element, initialEntries = ['/protected']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={element} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('redirige vers /login si aucun token', async () => {
    axios.get.mockResolvedValueOnce({}) // ne sera pas appelé
    renderWithRouter(
      <ProtectedRoute>
        <Dummy />
      </ProtectedRoute>,
      ['/protected']
    )

    // Le composant affiche d’abord “Chargement...” (loader)
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()

    // Comme pas de token => redirection /login
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument()
    })
  })

  it('affiche les enfants si token valide', async () => {
    localStorage.setItem('token', 'FAKE_TOKEN')
    axios.get.mockResolvedValueOnce({
      data: { role: 'user' },
    })

    renderWithRouter(
      <ProtectedRoute>
        <Dummy />
      </ProtectedRoute>
    )

    // Loader d'abord
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()

    // Puis le contenu protégé
    await waitFor(() => {
      expect(screen.getByTestId('ok')).toBeInTheDocument()
    })

    // Vérifie l’appel à /api/me avec le Bearer
    expect(axios.get).toHaveBeenCalledWith(
      'http://api.test/api/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer FAKE_TOKEN',
        }),
      })
    )
  })

  it("redirige si adminOnly=true et l'utilisateur n'est pas admin", async () => {
    localStorage.setItem('token', 'FAKE_TOKEN')
    axios.get.mockResolvedValueOnce({
      data: { role: 'user' }, // pas admin
    })

    renderWithRouter(
      <ProtectedRoute adminOnly>
        <Dummy />
      </ProtectedRoute>
    )

    // Loader
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()

    // Redirigé vers /login
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument()
    })
  })
})
