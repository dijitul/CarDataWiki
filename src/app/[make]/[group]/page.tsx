import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import type { Metadata } from 'next'

interface Props { params: { make: string; group: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  const models = await prisma.model.findMany({
    where:  { groupSlug: { not: null } },
    select: { groupSlug: true, make: { select: { slug: true } } },
  })
  const seen = new Set<string>()
  return models
    .filter(m => {
      const key = `${m.make.slug}/${m.groupSlug}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(m => ({ make: m.make.slug, group: m.groupSlug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const make = await prisma.make.findUnique({ where: { slug: params.make } })
  if (!make) return {}

  const models = await prisma.model.findMany({
    where: { makeId: make.id, groupSlug: params.group },
    select: { groupName: true, _count: { select: { variants: true } } },
  })
  if (!models.length) return {}

  const groupName  = models[0].groupName ?? params.group
  const totalVars  = models.reduce((s, m) => s + m._count.variants, 0)
  return {
    title: `${make.name} ${groupName} Specifications & Body Styles`,
    description: `Browse all ${make.name} ${groupName} body styles and variants. ${models.length} body style${models.length === 1 ? '' : 's'}, ${totalVars} variants with full technical specs, engine data, and fuel economy. Free CSV download.`,
    alternates: { canonical: `https://cardata.wiki/${make.slug}/${params.group}` },
  }
}

export default async function GroupPage({ params }: Props) {
  const make = await prisma.make.findUnique({ where: { slug: params.make } })
  if (!make) notFound()

  const models = await prisma.model.findMany({
    where:   { makeId: make.id, groupSlug: params.group },
    orderBy: { name: 'asc' },
    include: { _count: { select: { variants: true } } },
  })
  if (!models.length) notFound()

  const groupName = models[0].groupName ?? params.group

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `https://cardata.wiki/${make.slug}/${params.group}#modellist`,
        name: `${make.name} ${groupName} Body Styles`,
        numberOfItems: models.length,
        itemListElement: models.slice(0, 20).map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${make.name} ${m.name}`,
          url: `https://cardata.wiki/${make.slug}/${params.group}/${m.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',       item: 'https://cardata.wiki/' },
          { '@type': 'ListItem', position: 2, name: make.name,    item: `https://cardata.wiki/${make.slug}` },
          { '@type': 'ListItem', position: 3, name: groupName,    item: `https://cardata.wiki/${make.slug}/${params.group}` },
        ],
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[
        { label: 'Home',       href: '/' },
        { label: make.name,    href: `/${make.slug}` },
        { label: groupName },
      ]} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{make.name} {groupName}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {models.length} body style{models.length === 1 ? '' : 's'}
            {' · '}{models.reduce((s, m) => s + m._count.variants, 0)} variants
          </p>
        </div>
        <a
          href={`/api/download/group/${make.slug}/${params.group}`}
          className="btn-outline flex items-center gap-2 self-start"
          download
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
          </svg>
          Download {make.name} {groupName} specs (CSV)
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {models.map(model => (
          <Link
            key={model.id}
            href={`/${make.slug}/${params.group}/${model.slug}`}
            className="card p-4 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="font-medium text-sm text-slate-800 group-hover:text-primary-700">
              {model.name}
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
