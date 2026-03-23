'use client'

import { useState } from 'react'
import { SPEC_SECTIONS } from '@/lib/constants'
import { EditField } from '@/components/edit/EditField'

interface Props {
  variant: Record<string, unknown>
  variantId: string
  canEdit: boolean
  fuelTypeLabels: Record<string, string>
  gearboxLabels: Record<string, string>
  drivetrainLabels: Record<string, string>
}

function displayValue(key: string, raw: unknown, labels: Props): string {
  if (raw === null || raw === undefined || raw === '') return '—'
  if (key === 'engineFuelType') return labels.fuelTypeLabels[String(raw)] ?? String(raw)
  if (key === 'gearboxType')    return labels.gearboxLabels[String(raw)]    ?? String(raw)
  if (key === 'drivetrain')     return labels.drivetrainLabels[String(raw)] ?? String(raw)
  return String(raw)
}

export function SpecSections({ variant, variantId, canEdit, fuelTypeLabels, gearboxLabels, drivetrainLabels }: Props) {
  const [localVariant, setLocalVariant] = useState(variant)
  const [editingField, setEditingField] = useState<string | null>(null)

  const labels = { fuelTypeLabels, gearboxLabels, drivetrainLabels }

  function handleSaved(fieldName: string, newValue: string) {
    setLocalVariant(prev => ({ ...prev, [fieldName]: newValue }))
    setEditingField(null)
  }

  // Only show sections that have at least one non-null value
  const activeSections = SPEC_SECTIONS.filter(section =>
    section.fields.some(f => {
      const v = localVariant[f.key]
      return v !== null && v !== undefined && v !== ''
    })
  )

  return (
    <div className="space-y-6">
      {activeSections.map(section => (
        <div key={section.id} className="card overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{section.label}</h2>
          </div>
          <table className="spec-table w-full">
            <tbody>
              {section.fields.map(field => {
                const raw = localVariant[field.key]
                const hasValue = raw !== null && raw !== undefined && raw !== ''
                if (!hasValue && !canEdit) return null
                const displayed = displayValue(field.key, raw, labels)

                return (
                  <tr key={field.key} className={editingField === field.key ? 'field-edited' : ''}>
                    <td className="spec-table td text-slate-600 w-48">{field.label}</td>
                    <td className="spec-table td">
                      {editingField === field.key ? (
                        <EditField
                          variantId={variantId}
                          fieldName={field.key}
                          currentValue={String(raw ?? '')}
                          unit={field.unit}
                          onSaved={(val) => handleSaved(field.key, val)}
                          onCancel={() => setEditingField(null)}
                        />
                      ) : (
                        <div className="flex items-center justify-between gap-2 group">
                          <span className={`spec-value font-mono tabular-nums ${!hasValue ? 'text-slate-300 italic' : 'text-slate-800'}`}>
                            {hasValue ? displayed : 'not set'}
                            {hasValue && field.unit && (
                              <span className="text-slate-400 text-xs ml-1">{field.unit}</span>
                            )}
                          </span>
                          {canEdit && (
                            <button
                              onClick={() => setEditingField(field.key)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary-600 p-1"
                              title={`Edit ${field.label}`}
                              aria-label={`Edit ${field.label}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
