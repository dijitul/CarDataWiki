import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SpecSections } from '@/components/browse/SpecSections'
import { FUEL_TYPE_LABELS, GEARBOX_LABELS, DRIVETRAIN_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

interface Props { params: { make: string; group: string; model: string; variant: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  const variants = await prisma.modelVariant.findMany({
    select: {
      slug: true,
      model: { select: { slug: true, groupSlug: true, make: { select: { slug: true } } } },
    },
  })
  return variants.map(v => ({
    make:    v.model.make.slug,
    group:   v.model.groupSlug ?? v.model.slug,
    model:   v.model.slug,
    variant: v.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const variant = await prisma.modelVariant.findUnique({
    where: { slug: params.variant },
    include: { model: { include: { make: true } } },
  })
  if (!variant) return {}
  const m     = variant.model
  const power = variant.enginePowerBhp ? ` — ${variant.enginePowerBhp}bhp` : ''
  const accel = variant.acceleration0100 ? `, ${variant.acceleration0100}s` : ''
  return {
    title: `${m.make.name} ${m.name} ${variant.name} Specs${power}${accel}`,
    description: `${m.make.name} ${m.name} ${variant.name} full specifications: ${variant.enginePowerBhp ? `${variant.enginePowerBhp}bhp` : ''}${variant.engineTorqueNm ? `, ${variant.engineTorqueNm}Nm` : ''}${variant.acceleration0100 ? `, ${variant.acceleration0100}s 0-100km/h` : ''}${variant.fuelEconomyCombinedMpg ? `, ${variant.fuelEconomyCombinedMpg}mpg` : ''}. Free CSV download.`,
    alternates: { canonical: `https://cardata.wiki/${params.make}/${params.group}/${params.model}/${variant.slug}` },
  }
}

export default async function VariantPage({ params }: Props) {
  const variant = await prisma.modelVariant.findUnique({
    where: { slug: params.variant },
    include: { model: { include: { make: true } } },
  })
  if (
    !variant ||
    variant.model.slug !== params.model ||
    variant.model.make.slug !== params.make ||
    (variant.model.groupSlug ?? variant.model.slug) !== params.group
  ) notFound()

  const m    = variant.model
  const make = m.make
  const groupName = m.groupName ?? params.group

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Car',
        '@id': `https://cardata.wiki/${params.make}/${params.group}/${params.model}/${variant.slug}#vehicle`,
        name:   `${make.name} ${m.name} ${variant.name}`,
        brand:  { '@type': 'Brand', name: make.name },
        model:  m.name,
        vehicleConfiguration: variant.name,
        ...(variant.bodyType       ? { bodyType: variant.bodyType } : {}),
        ...(variant.doors          ? { numberOfDoors: variant.doors } : {}),
        ...(variant.engineFuelType ? { fuelType: variant.engineFuelType } : {}),
        ...(variant.enginePowerBhp ? { enginePower: { '@type': 'QuantitativeValue', value: Number(variant.enginePowerBhp), unitCode: 'BHP' } } : {}),
        ...(variant.engineTorqueNm ? { torque: { '@type': 'QuantitativeValue', value: Number(variant.engineTorqueNm), unitCode: 'N.m' } } : {}),
        ...(variant.acceleration0100 ? { accelerationTime: { '@type': 'QuantitativeValue', value: Number(variant.acceleration0100), unitCode: 'SEC' } } : {}),
        ...(variant.fuelEconomyCombinedMpg ? { fuelConsumption: { '@type': 'QuantitativeValue', value: Number(variant.fuelEconomyCombinedMpg), unitText: 'mpg combined' } } : {}),
        ...(variant.co2Gkm   ? { emissionsCO2: { '@type': 'QuantitativeValue', value: variant.co2Gkm, unitCode: 'GQ' } } : {}),
        ...(variant.weightKg ? { weight: { '@type': 'QuantitativeValue', value: variant.weightKg, unitCode: 'KGM' } } : {}),
        url: `https://cardata.wiki/${params.make}/${params.group}/${params.model}/${variant.slug}`,
      },
      {
        '@type': 'Dataset',
        name:    `${make.name} ${m.name} ${variant.name} Specification Data`,
        creator: { '@type': 'Organization', name: 'cardata.wiki' },
        distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `https://cardata.wiki/api/download/model/${m.slug}` }],
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://cardata.wiki/' },
          { '@type': 'ListItem', position: 2, name: make.name,     item: `https://cardata.wiki/${params.make}` },
          { '@type': 'ListItem', position: 3, name: groupName,     item: `https://cardata.wiki/${params.make}/${params.group}` },
          { '@type': 'ListItem', position: 4, name: m.name,        item: `https://cardata.wiki/${params.make}/${params.group}/${params.model}` },
          { '@type': 'ListItem', position: 5, name: variant.name,  item: `https://cardata.wiki/${params.make}/${params.group}/${params.model}/${variant.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[
        { label: 'Home',        href: '/' },
        { label: make.name,     href: `/${params.make}` },
        { label: groupName,     href: `/${params.make}/${params.group}` },
        { label: m.name,        href: `/${params.make}/${params.group}/${params.model}` },
        { label: variant.name },
      ]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{make.name} {m.name} {variant.name}</h1>
          {(variant.yearFrom || variant.bodyType) && (
            <p className="text-slate-500 text-sm mt-1">
              {[variant.bodyType, variant.yearFrom && `${variant.yearFrom}${variant.yearTo ? `–${variant.yearTo}` : '–'}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <a
            href={`/api/download/variant/${params.variant}`}
            className="btn-outline flex items-center gap-2 text-xs"
            download
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
            </svg>
            Download CSV
          </a>
          <Link
            href={`/${params.make}/${params.group}/${params.model}/${params.variant}/history`}
            className="btn-ghost text-xs"
          >
            View edit history
          </Link>
        </div>
      </div>

      {/* Hero stats */}
      {(variant.enginePowerBhp || variant.acceleration0100 || variant.topSpeedMph || variant.fuelEconomyCombinedMpg) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Power',      val: variant.enginePowerBhp           ? `${variant.enginePowerBhp}` : null,           unit: 'bhp' },
            { label: '0–100 km/h', val: variant.acceleration0100         ? `${variant.acceleration0100}` : null,         unit: 's'   },
            { label: 'Top Speed',  val: variant.topSpeedMph              ? `${variant.topSpeedMph}` : null,              unit: 'mph' },
            { label: 'Economy',    val: variant.fuelEconomyCombinedMpg   ? `${variant.fuelEconomyCombinedMpg}` : null,   unit: 'mpg' },
          ].filter(s => s.val).map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-2xl font-bold font-mono tabular-nums text-primary-800">{stat.val}</div>
              <div className="text-xs text-slate-400">{stat.unit}</div>
              <div className="text-xs font-medium text-slate-600 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Spec sections */}
      <SpecSections
        variant={variant as Record<string, unknown>}
        variantId={variant.id}
        fuelTypeLabels={FUEL_TYPE_LABELS}
        gearboxLabels={GEARBOX_LABELS}
        drivetrainLabels={DRIVETRAIN_LABELS}
      />

      {/* Back link */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Other {make.name} {m.name} Variants</h2>
        <Link href={`/${params.make}/${params.group}/${params.model}`} className="btn-outline text-sm">
          ← All {make.name} {m.name} variants
        </Link>
      </div>
    </div>
  )
}
