import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [revisionCount, subscription, apiKeys, submissions] = await Promise.all([
    prisma.revision.count({ where: { userId: session.user.id } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.apiKey.count({ where: { userId: session.user.id, isActive: true } }),
    prisma.csvSubmission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, originalName: true, status: true, createdAt: true },
    }),
  ])

  const isActive = subscription?.status === 'ACTIVE'

  const statusBadge: Record<string, string> = {
    PENDING_ANALYSIS: 'badge-yellow', ANALYSING: 'badge-yellow',
    AWAITING_REVIEW: 'badge-blue',   APPROVED: 'badge-green',
    DISCARDED: 'badge-red',          FAILED: 'badge-red',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Welcome back, {session.user.name ?? session.user.email}</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <div className="text-3xl font-bold font-mono tabular-nums text-primary-800">{revisionCount}</div>
          <div className="text-sm text-slate-500 mt-1">Edits contributed</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-bold font-mono tabular-nums text-primary-800">{apiKeys}</div>
          <div className="text-sm text-slate-500 mt-1">Active API keys</div>
        </div>
        <div className="card p-5">
          <div className={`text-sm font-semibold ${isActive ? 'text-green-700' : 'text-slate-500'}`}>
            {isActive ? '✓ API Subscription Active' : 'No API subscription'}
          </div>
          <div className="mt-2">
            {isActive ? (
              <Link href="/dashboard/api-keys" className="btn-outline text-xs">Manage API keys</Link>
            ) : (
              <Link href="/dashboard/billing" className="btn-accent text-xs">Subscribe — £20/mo</Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link href="/dashboard/api-keys" className="card p-5 hover:border-primary-300 transition-colors group">
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-700">API Keys</h2>
          <p className="text-sm text-slate-500 mt-1">Generate and manage your API keys for programmatic access.</p>
        </Link>
        <Link href="/dashboard/submissions" className="card p-5 hover:border-primary-300 transition-colors group">
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-700">Data Submissions</h2>
          <p className="text-sm text-slate-500 mt-1">Upload CSV files to contribute vehicle data to the database.</p>
        </Link>
      </div>

      {/* Recent submissions */}
      {submissions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Submissions</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">File</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map(s => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 font-medium text-slate-700">{s.originalName}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${statusBadge[s.status] ?? 'badge-grey'}`}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
