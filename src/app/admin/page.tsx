import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const [pending, total, users, variantCount] = await Promise.all([
    prisma.csvSubmission.count({ where: { status: 'AWAITING_REVIEW' } }),
    prisma.csvSubmission.count(),
    prisma.user.count(),
    prisma.modelVariant.count(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Admin Panel</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { val: pending,      label: 'Pending submissions', urgent: pending > 0 },
          { val: total,        label: 'Total submissions',   urgent: false },
          { val: users,        label: 'Registered users',    urgent: false },
          { val: variantCount.toLocaleString(), label: 'Variants in DB', urgent: false },
        ].map(s => (
          <div key={s.label} className={`card p-5 ${s.urgent ? 'border-amber-300 bg-amber-50' : ''}`}>
            <div className={`text-3xl font-bold font-mono tabular-nums ${s.urgent ? 'text-amber-700' : 'text-primary-800'}`}>{s.val}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/submissions" className="card p-5 hover:border-primary-300 transition-colors group">
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-700">
            CSV Submissions {pending > 0 && <span className="badge badge-yellow ml-2">{pending} pending</span>}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review, approve or discard user-submitted data files.</p>
        </Link>
        <Link href="/admin/users" className="card p-5 hover:border-primary-300 transition-colors group">
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-700">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">View all users and manage roles.</p>
        </Link>
      </div>
    </div>
  )
}
