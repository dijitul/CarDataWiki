import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import type { Metadata } from 'next'

interface Props { params: { make: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  const makes = await prisma.make.findMany({ select: { slug: true } })
  return makes.map(m => ({ make: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const make = await prisma.make.findUnique({
    where: { slug: params.make },
    include: { _count: { select: { models: true } } },
  })
  if (!make) return {}
  return {
    title: `${make.name} Car Specifications & Models`,
    description: `Browse all ${make.name} models and full technical specifications. Engine sizes, dimensions, performance figures and fuel economy for ${make._count.models} ${make.name} models. Free CSV download.`,
    alternates: { canonical: `https://cardata.wiki/${make.slug}` },
  }
}

export default async function MakePage({ params }: Props) {
  const make = await prisma.make.findUnique({
    where: { slug: params.make },
    include: {
      models: {
        orderBy: { name: 'asc' },
        include: { _count: { select: { variants: true } } },
      },
    },
  })
  if (!make) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `https://cardata.wiki/${make.slug}#modellist`,
        name: `${make.name} Models`,
        numberOfItems: make.models.length,
        itemListElement: make.models.slice(0, 20).map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${make.name} ${m.name}`,
          url: `https://cardata.wiki/${make.slug}/${m.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cardata.wiki/' },
          { '@type': 'ListItem', position: 2, name: make.name, item: `https://cardata.wiki/${make.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: make.name }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{make.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{make.models.length} models · {make.country ?? 'International'}</p>
        </div>
        <a
          href={`/api/download/make/${make.slug}`}
          className="btn-outline flex items-center gap-2 self-start"
          download
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
          Download all {make.name} specs (CSV)
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {make.models.map(model => (
          <Link
            key={model.id}
            href={`/${make.slug}/${model.slug}`}
            className="card p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="font-medium text-sm text-slate-800 group-hover:text-primary-700">
              {make.name} {model.name}
            </div>
            {model.bodyStyle && (
              <div className="text-xs text-slate-400 mt-0.5">{model.bodyStyle}</div>
            )}
            <div className="text-xs text-slate-400">{model._count.variants} variants</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
