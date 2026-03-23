'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BillingActions({ isActive }: { isActive: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  async function handlePortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  if (isActive) {
    return (
      <button onClick={handlePortal} disabled={loading} className="btn-outline">
        {loading ? 'Loading…' : 'Manage billing / cancel'}
      </button>
    )
  }

  return (
    <button onClick={handleSubscribe} disabled={loading} className="btn-accent px-6 py-3 text-base font-semibold">
      {loading ? 'Loading…' : 'Subscribe — £20/month'}
    </button>
  )
}
