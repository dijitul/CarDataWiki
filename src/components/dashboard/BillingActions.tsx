'use client'

import { useState } from 'react'

export function BillingActions({ isActive }: { isActive: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function go(endpoint: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (data?.url) {
        window.location.href = data.url
        return // keep the button in its loading state while the browser navigates
      }
      setError(data?.error ?? 'Something went wrong. Please try again.')
    } catch {
      setError('Could not reach the server. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      {isActive ? (
        <button onClick={() => go('/api/stripe/portal')} disabled={loading} className="btn-outline">
          {loading ? 'Loading…' : 'Manage billing / cancel'}
        </button>
      ) : (
        <button onClick={() => go('/api/stripe/checkout')} disabled={loading} className="btn-accent px-6 py-3 text-base font-semibold">
          {loading ? 'Loading…' : 'Subscribe — £20/month'}
        </button>
      )}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  )
}
