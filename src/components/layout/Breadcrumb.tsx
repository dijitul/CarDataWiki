import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-primary-700 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
