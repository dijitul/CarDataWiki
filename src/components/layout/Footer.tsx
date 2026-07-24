import Link from 'next/link'
import { getSiteCounts } from '@/lib/stats'

export async function Footer() {
  const { makes, models, variants } = await getSiteCounts()
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="4" fill="#1e40af"/>
                <path d="M4 20 L8 10 L12 16 L16 8 L20 14 L24 10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="24" cy="10" r="2" fill="#f59e0b"/>
              </svg>
              <span className="font-bold text-sm text-slate-900">cardata<span className="text-primary-700">.wiki</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Free, community-edited vehicle specifications database. {makes.toLocaleString()} makes, {models.toLocaleString()} models, {variants.toLocaleString()} variants.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/makes" className="hover:text-primary-700">All Makes</Link></li>
              <li><Link href="/makes#popular" className="hover:text-primary-700">Popular Makes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Developers</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/api-docs" className="hover:text-primary-700">API Documentation</Link></li>
              <li><Link href="/dashboard/api-keys" className="hover:text-primary-700">API Keys</Link></li>
              <li><Link href="/dashboard/billing" className="hover:text-primary-700">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Project</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-primary-700">About</Link></li>
              <li><Link href="/contribute" className="hover:text-primary-700">Contribute Data</Link></li>
              <li><Link href="/login" className="hover:text-primary-700">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary-700">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} cardata.wiki — Data available under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="hover:text-primary-600 underline" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
            <Link href="/terms"   className="hover:text-slate-600">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
