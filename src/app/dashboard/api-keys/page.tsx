'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ApiKey { id: string; keyPrefix: string; name: string | null; lastUsedAt: string | null; createdAt: string }

export default function ApiKeysPage() {
  const [keys, setKeys]       = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey]   = useState<string | null>(null)
  const [keyName, setKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function loadKeys() {
    const res = await fetch('/api/api-keys')
    if (res.ok) { const d = await res.json(); setKeys(d.keys) }
    setLoading(false)
  }

  useEffect(() => { loadKeys() }, [])

  async function create() {
    setCreating(true)
    setError(null)
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: keyName || undefined }),
    })
    const d = await res.json()
    if (!res.ok) { setError(d.error); setCreating(false); return }
    setNewKey(d.key)
    setKeyName('')
    setCreating(false)
    loadKeys()
  }

  async function revoke(id: string) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    await fetch('/api/api-keys', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadKeys()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <p className="text-sm text-slate-500 mt-1">Keys authenticate requests to /api/v1/*</p>
        </div>
        <Link href="/dashboard" className="btn-ghost text-sm">← Dashboard</Link>
      </div>

      {/* New key reveal */}
      {newKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-green-800 mb-2">✓ API key created — copy it now. It won&apos;t be shown again.</p>
          <code className="block bg-white border border-green-200 rounded px-3 py-2 text-sm font-mono break-all select-all">{newKey}</code>
          <button onClick={() => { navigator.clipboard.writeText(newKey); }} className="btn-outline text-xs mt-2">Copy to clipboard</button>
          <button onClick={() => setNewKey(null)} className="btn-ghost text-xs mt-2 ml-2">Dismiss</button>
        </div>
      )}

      {/* Generate form */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Generate new key</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key label (optional)"
            value={keyName}
            onChange={e => setKeyName(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button onClick={create} disabled={creating} className="btn-primary">
            {creating ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Key list */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-slate-500">No active keys.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Key</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Label</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Last used</th>
                <th className="px-4 py-2"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keys.map(k => (
                <tr key={k.id}>
                  <td className="px-4 py-2 font-mono text-xs text-slate-700">{k.keyPrefix}…</td>
                  <td className="px-4 py-2 text-slate-600">{k.name ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-500">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString('en-GB') : 'Never'}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => revoke(k.id)} className="text-xs text-red-600 hover:underline">Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
