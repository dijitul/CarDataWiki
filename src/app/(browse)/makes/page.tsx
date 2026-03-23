import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Car Makes — Vehicle Specifications Database',
  description: 'Browse all 124 vehicle makes in the cardata.wiki database. Find full technical specifications, engine data, and performance figures for every manufacturer.',
}

export const revalidate = 86400

export default async function MakesPage() {
  const makes = await prisma.make.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { models: true } } },
  })

  // Group A-Z
  const grouped = makes.reduce<Record<string, typeof makes>>((acc, make) => {
    const letter = make.name[0].toUpperCase()
    acc[letter] = acc[letter] ?? []
    acc[letter].push(make)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">All Car Makes</h1>
      <p className="text-slate-500 text-sm mb-8">{makes.length} manufacturers · click any make to browse models and specifications</p>

      {Object.entries(grouped).sort().map(([letter, items]) => (
        <div key={letter} className="mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">{letter}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {items.map(make => (
              <Link
                key={make.id}
                href={`/${make.slug}`}
                className="card p-3 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className="font-medium text-sm text-slate-800 group-hover:text-primary-700">{make.name}</div>
                <div className="text-xs text-slate-400">{make._count.models} models</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
