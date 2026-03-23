import type { Revision } from '@prisma/client'

interface Props {
  revision: Revision & { user: { name: string | null; email: string } }
}

export function DiffView({ revision }: Props) {
  const displayName = revision.user.name ?? revision.user.email.split('@')[0]
  const date = new Date(revision.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="border border-slate-200 rounded-lg p-3 text-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono font-medium text-slate-700 text-xs">{revision.fieldName}</span>
        <span className="text-xs text-slate-400">{date} · {displayName}</span>
      </div>

      <div className="space-y-1 font-mono text-sm">
        {revision.oldValue !== null && (
          <div className="diff-removed px-2 py-0.5 rounded-sm">
            – {revision.oldValue || <em className="not-italic text-slate-400">empty</em>}
          </div>
        )}
        {revision.newValue !== null && (
          <div className="diff-added px-2 py-0.5 rounded-sm">
            + {revision.newValue || <em className="not-italic text-slate-400">empty</em>}
          </div>
        )}
      </div>

      {revision.comment && (
        <p className="mt-2 text-xs text-slate-500 italic">"{revision.comment}"</p>
      )}
    </div>
  )
}
