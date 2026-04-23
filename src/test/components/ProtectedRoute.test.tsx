import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ProtectedRoute from '@/components/ProtectedRoute'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, hasRole: () => false }),
}))

describe('ProtectedRoute', () => {
  it('redirects to /auth when no user', () => {
    render(
      <MemoryRouter initialEntries={['/member']}>
        <ProtectedRoute><div>protected</div></ProtectedRoute>
      </MemoryRouter>
    )
    expect(screen.queryByText('protected')).toBeNull()
  })
})
