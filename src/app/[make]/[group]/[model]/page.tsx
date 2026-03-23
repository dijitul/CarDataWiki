import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import type { Metadata } from 'next'

interface Props { params: { make: string; group: string; model: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  const models = await prisma.model.findMany({
    select: { slug: true, groupSlug: true, make: { select: { slug: true } } },
  })
  return models.map(m => ({
    make:  m.make.slug,
    group: m.groupSlug ?? m.slug,
    model: m.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await prisma.model.findUnique({
    where: { slug: params.model },
    include: { make: true, _count: { select: { variants: true } } },
  })
  if (!model) return {}
  return {
    title: `${model.make.name} ${model.name} Specifications & Variants`,
    description: `Full technical specifications for all ${model.make.name} ${model.name} variants. Compare engine options, dimensions, power output, torque, fuel economy and performance figures across ${model._count.variants} variants. Download data free.`,
    alternates: { canonical: `https://cardata.wiki/${params.make}/${params.group}/${model.slug}` },
  }
}

export default async function ModelPage({ params }: Props) {
  const model = await prisma.model.findUnique({
    where: { slug: params.model },
    include: {
      make: true,
      variants: { orderBy: [{ yearFrom: 'desc' }, { name: 'asc' }] },
    },
  })
  if (
    !model ||
    model.make.slug !== params.make ||
    (model.groupSlug ?? model.slug) !== params.group
  ) notFound()

  const groupName = model.groupName ?? params.group

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `https://cardata.wiki/${params.make}/${params.group}/${model.slug}#variantlist`,
        name: `${model.make.name} ${model.name} Variants`,
        numberOfItems: model.variants.length,
        itemListElement: model.variants.slice(0, 20).map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${model.make.name} ${model.name} ${v.name}`,
          url: `https://cardata.wiki/${params.make}/${params.group}/${model.slug}/${v.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://cardata.wiki/' },
          { '@type': 'ListItem', position: 2, name: model.make.name, item: `https://cardata.wiki/${params.make}` },
          { '@type': 'ListItem', position: 3, name: groupName,     item: `https://cardata.wiki/${params.make}/${params.group}` },
          { '@type': 'ListItem', position: 4, name: model.name,    item: `https://cardata.wiki/${params.make}/${params.group}/${model.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[
        { label: 'Home',            href: '/' },
        { label: model.make.name,   href: `/${params.make}` },
        { label: groupName,         href: `/${params.make}/${params.group}` },
        { label: model.name },
      ]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{model.make.name} {model.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {model.variants.length} variants{model.bodyStyle ? ` · ${model.bodyStyle}` : ''}
          </p>
        </div>
        <a
          href={`/api/download/model/${model.slug}`}
          className="btn-outline flex items-center gap-2 self-start"
          download
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
          </svg>
          Download CSV
        </a>
      </div>

      {/* Edit hint */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 text-primary-400">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
        </svg>
        Click any variant name to view full specifications. Sign in to edit data.
      </div>

      {/* Variants table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Variant</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Years</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Fuel</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Power</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">0–100</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">MPG</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">CO₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {model.variants.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/${params.make}/${params.group}/${model.slug}/${v.slug}`}
                      className="text-primary-700 hover:underline font-medium"
                    >
                      {v.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs tabular-nums">
                    {v.yearFrom ?? '—'}{v.yearTo ? `–${v.yearTo}` : v.yearFrom ? '–' : ''}
                  </td>
                  <td className="px-4 py-3">
                    {v.engineFuelType && (
                      <span className="badge badge-grey">{v.engineFuelType.replace(/_/g, ' ')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                    {v.enginePowerBhp ? `${v.enginePowerBhp} bhp` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                    {v.acceleration0100 ? `${v.acceleration0100}s` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                    {v.fuelEconomyCombinedMpg ? `${v.fuelEconomyCombinedMpg}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                    {v.co2Gkm ? `${v.co2Gkm}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
