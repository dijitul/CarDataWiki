'use client'

import { useState } from 'react'

interface Props {
  variantId: string
  fieldName: string
  currentValue: string
  unit: string
  onSaved: (newValue: string) => void
  onCancel: () => void
}

export function EditField({ variantId, fieldName, currentValue, unit, onSaved, onCancel }: Props) {
  const [value, setValue] = useState(currentValue)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === currentValue) { onCancel(); return }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, fieldName, newValue: value, comment }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save')
        return
      }
      onSaved(value)
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 py-1">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="border border-primary-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 w-36"
        />
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      <input
        type="text"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Edit summary (optional)"
        className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400 text-slate-600"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary text-xs px-3 py-1">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost text-xs">
          Cancel
        </button>
      </div>
    </form>
  )
}
