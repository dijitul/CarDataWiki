'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Sub { id: string; originalName: string; rowCount: number; status: string; createdAt: string }

const STATUS_BADGE: Record<string, string> = {
  PENDING_ANALYSIS: 'badge-yellow', ANALYSING: 'badge-yellow',
  AWAITING_REVIEW: 'badge-blue',   APPROVED: 'badge-green',
  DISCARDED: 'badge-red',          FAILED: 'badge-red',
}

export default function SubmissionsPage() {
  const [subs, setSubs]       = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const res = await fetch('/api/submissions')
    if (res.ok) { const d = await res.json(); setSubs(d.submissions) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/submissions', { method: 'POST', body: fd })
    const d = await res.json()
    setUploading(false)
    if (!res.ok) { setError(d.error); return }
    if (fileRef.current) fileRef.current.value = ''
    load()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">Upload CSVs to contribute vehicle data. Our team reviews all submissions.</p>
        </div>
        <Link href="/dashboard" className="btn-ghost text-sm">← Dashboard</Link>
      </div>

      {/* Upload form */}
      <div className="card p-5 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Upload a CSV</h2>
        <p className="text-xs text-slate-500 mb-4">
          CSV should include columns: make, model, variant, plus any spec fields (enginePowerBhp, co2Gkm, etc).
          Maximum 10MB. Our AI will analyse the data and flag any issues before admin review.
        </p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleUpload} className="flex gap-2 items-center">
          <input ref={fileRef} type="file" accept=".csv" required className="text-sm text-slate-600 flex-1"/>
          <button type="submit" disabled={uploading} className="btn-primary whitespace-nowrap">
            {uploading ? 'Uploading…' : 'Upload CSV'}
          </button>
        </form>
      </div>

      {/* Submissions list */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : subs.length === 0 ? (
        <p className="text-sm text-slate-500">No submissions yet.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">File</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Rows</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subs.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-2 font-medium text-slate-700">{s.originalName}</td>
                  <td className="px-4 py-2 font-mono text-slate-600">{s.rowCount}</td>
                  <td className="px-4 py-2">
                    <span className={`badge ${STATUS_BADGE[s.status] ?? 'badge-grey'}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">{new Date(s.createdAt).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
