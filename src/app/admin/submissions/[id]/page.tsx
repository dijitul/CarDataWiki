'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { AiAnalysisReport } from '@/lib/csv/ai-analyser'

interface Submission {
  id: string; originalName: string; rowCount: number; status: string
  aiReport: AiAnalysisReport | null; adminNote: string | null; createdAt: string
}

export default function AdminReviewPage() {
  const params = useRouter() // just to trigger re-render
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [sub, setSub]       = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote]     = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    fetch(`/api/submissions/${id}`)
      .then(r => r.json())
      .then(d => { setSub(d.submission); setLoading(false) })
  }, [id])

  async function act(action: 'approve' | 'discard') {
    if (!confirm(`${action === 'approve' ? 'Approve and import' : 'Discard'} this submission?`)) return
    setActing(true)
    await fetch(`/api/submissions/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNote: note || undefined }),
    })
    router.push('/admin/submissions')
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-slate-500">Loading…</div>
  if (!sub)    return <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-red-600">Not found</div>

  const report = sub.aiReport

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Review: {sub.originalName}</h1>
        <Link href="/admin/submissions" className="btn-ghost text-sm">← Back</Link>
      </div>

      {/* Meta */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
        <span><strong>Rows:</strong> {sub.rowCount}</span>
        <span><strong>Status:</strong> {sub.status.replace(/_/g, ' ')}</span>
        <span><strong>Submitted:</strong> {new Date(sub.createdAt).toLocaleDateString('en-GB')}</span>
      </div>

      {/* AI Report */}
      {report ? (
        <div className="space-y-4 mb-8">
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">AI Summary</h2>
            <p className="text-sm text-slate-600">{report.summary}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              <span className="badge badge-green">{report.newRows?.length ?? 0} new rows</span>
              <span className="badge badge-grey">{report.duplicates?.length ?? 0} duplicates</span>
              <span className="badge badge-yellow">{report.conflicts?.length ?? 0} conflicts</span>
              <span className="badge badge-red">{report.validationErrors?.length ?? 0} validation errors</span>
              <span className="badge badge-blue">Confidence: {report.confidence}</span>
            </div>
          </div>

          {report.conflicts?.length > 0 && (
            <div className="card overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
                <h2 className="text-sm font-semibold text-amber-800">Conflicts ({report.conflicts.length})</h2>
              </div>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-3 py-1 text-slate-500">Row</th>
                  <th className="text-left px-3 py-1 text-slate-500">Field</th>
                  <th className="text-left px-3 py-1 text-slate-500">DB value</th>
                  <th className="text-left px-3 py-1 text-slate-500">CSV value</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {report.conflicts.map((c, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 font-mono">{c.rowIndex}</td>
                      <td className="px-3 py-1.5 font-mono">{c.field}</td>
                      <td className="px-3 py-1.5 text-red-600 line-through">{c.existingValue}</td>
                      <td className="px-3 py-1.5 text-green-700">{c.csvValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.unknownFields?.length > 0 && (
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-1">Unknown fields</h2>
              <p className="text-xs font-mono text-slate-500">{report.unknownFields.join(', ')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-4 mb-8 text-sm text-slate-500">
          AI analysis is {sub.status === 'ANALYSING' ? 'in progress…' : 'not yet available.'}
        </div>
      )}

      {/* Actions */}
      {sub.status === 'AWAITING_REVIEW' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Admin note (optional)</h2>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add a note for the submitter…"
          />
          <div className="flex gap-3">
            <button onClick={() => act('approve')} disabled={acting} className="btn-primary">
              ✓ Approve & Import
            </button>
            <button onClick={() => act('discard')} disabled={acting} className="btn-outline text-red-600 border-red-200 hover:bg-red-50">
              ✕ Discard
            </button>
          </div>
        </div>
      )}

      {(sub.status === 'APPROVED' || sub.status === 'DISCARDED') && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-slate-700">{sub.status} {sub.adminNote ? `— "${sub.adminNote}"` : ''}</p>
        </div>
      )}
    </div>
  )
}
