import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, string> = {
  PENDING_ANALYSIS: 'badge-yellow', ANALYSING: 'badge-yellow',
  AWAITING_REVIEW: 'badge-blue',   APPROVED: 'badge-green',
  DISCARDED: 'badge-red',          FAILED: 'badge-red',
}

export default async function AdminSubmissionsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const submissions = await prisma.csvSubmission.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { name: true, email: true } } },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">CSV Submissions</h1>
        <Link href="/admin" className="btn-ghost text-sm">← Admin</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">File</th>
              <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">User</th>
              <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Rows</th>
              <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Status</th>
              <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Date</th>
              <th className="px-4 py-2"/>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-700">{s.originalName}</td>
                <td className="px-4 py-2 text-slate-500">{s.user.name ?? s.user.email}</td>
                <td className="px-4 py-2 font-mono text-slate-600">{s.rowCount}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${STATUS_BADGE[s.status] ?? 'badge-grey'}`}>
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-500">{new Date(s.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/submissions/${s.id}`} className="text-xs text-primary-700 hover:underline">
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
