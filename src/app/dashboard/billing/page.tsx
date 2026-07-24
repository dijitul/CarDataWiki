import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BillingActions } from '@/components/dashboard/BillingActions'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  const isActive = subscription?.status === 'ACTIVE'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <Link href="/dashboard" className="btn-ghost text-sm">← Dashboard</Link>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">API Access Plan</h2>
            <p className="text-sm text-slate-500 mt-0.5">£20 + VAT / month · REST API · usage dashboard · cancel anytime</p>
          </div>
          <span className={`badge ${isActive ? 'badge-green' : 'badge-grey'}`}>
            {subscription?.status?.replace(/_/g, ' ') ?? 'Inactive'}
          </span>
        </div>

        {isActive && subscription?.currentPeriodEnd && (
          <p className="text-xs text-slate-400 mt-3">
            Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>

      <BillingActions isActive={isActive} />

      {/* Features */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">What&apos;s included</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {[
            'REST API access to all 30,000+ variants',
            'JSON responses with full spec data',
            'Filter by make, model, fuel type, year',
            'Paginated endpoints — up to 200 results per call',
            'Usage dashboard',
            'Up to 5 API keys per account',
          ].map(f => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
