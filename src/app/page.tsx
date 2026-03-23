import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'cardata.wiki — Free Vehicle Specifications Database',
  description: 'Free, community-edited vehicle specifications database. Technical data for 30,000+ car variants — engine specs, performance, dimensions, fuel economy. Free CSV download. Developer API available.',
}

export const revalidate = 3600

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://cardata.wiki/#website',
      name: 'cardata.wiki',
      url: 'https://cardata.wiki',
      description: 'Free vehicle specifications database with data on 30,000+ car variants.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://cardata.wiki/makes?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Dataset',
      '@id': 'https://cardata.wiki/#dataset',
      name: 'cardata.wiki Vehicle Specifications Database',
      description: 'Comprehensive database of vehicle technical specifications covering 124 makes, 7,200+ models, and 30,000+ variants.',
      creator: { '@type': 'Organization', name: 'cardata.wiki', url: 'https://cardata.wiki' },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    },
  ],
}

const FAQ = [
  { q: 'Is cardata.wiki free to use?', a: 'Yes. All vehicle specifications are free to browse and download as CSV files at any level — by make, model, or individual variant. No account required.' },
  { q: 'How many vehicles does cardata.wiki cover?', a: 'The database covers over 30,000 vehicle variants across 7,000+ models from 124 manufacturers worldwide.' },
  { q: 'Can I access the data via API?', a: 'Yes. A REST API is available for developers at £20/month, providing programmatic access to all specification data in JSON format.' },
  { q: 'Can I contribute or correct data?', a: 'Absolutely. Sign in to edit any specification value — all changes are tracked with a full revision history, just like Wikipedia.' },
  { q: 'What specification fields are available?', a: 'Each variant includes engine specs, performance figures, dimensions, fuel economy, emissions data, drivetrain configuration, tyres, brakes, and more — over 40 fields per variant.' },
]

export default async function HomePage() {
  const [makeCount, modelCount, variantCount, makes] = await Promise.all([
    prisma.make.count(),
    prisma.model.count(),
    prisma.modelVariant.count(),
    prisma.make.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { models: true } } },
    }),
  ])

  const popularMakes = [
    'Ford','BMW','Mercedes-Benz','Volkswagen','Audi','Toyota','Honda',
    'Vauxhall','Hyundai','Kia','Nissan','Peugeot','Renault','Skoda','Volvo',
  ]

  const sorted = [
    ...makes.filter(m => popularMakes.some(p => p.toLowerCase() === m.name.toLowerCase())),
    ...makes.filter(m => !popularMakes.some(p => p.toLowerCase() === m.name.toLowerCase())),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-950 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            The Free Car Specifications Database
          </h1>
          <p className="text-lg text-primary-200 mb-8 max-w-2xl mx-auto">
            Technical data for {variantCount.toLocaleString()}+ vehicle variants across {makeCount} makes and {modelCount.toLocaleString()} models.
            Community-edited, like Wikipedia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/makes" className="btn bg-accent-500 hover:bg-accent-400 text-white px-6 py-3 text-base font-semibold rounded">
              Browse All Makes
            </Link>
            <Link href="/api-docs" className="btn border border-primary-400 text-primary-100 hover:bg-primary-800 px-6 py-3 text-base rounded">
              Developer API
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary-800 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { val: makeCount, label: 'Makes' },
            { val: modelCount.toLocaleString(), label: 'Models' },
            { val: variantCount.toLocaleString(), label: 'Variants' },
            { val: 'Free', label: 'CSV Download' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-bold font-mono tabular-nums">{stat.val}</div>
              <div className="text-xs text-primary-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by make */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="popular">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Browse by Make</h2>
        <p className="text-slate-500 text-sm mb-8">Select a manufacturer to explore all models and spec variants.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sorted.map(make => (
            <Link
              key={make.id}
              href={`/${make.slug}`}
              className="card p-4 text-center hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className="font-medium text-sm text-slate-800 group-hover:text-primary-700">{make.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{make._count.models} models</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data fields section */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">What Data Is Included</h2>
          <p className="text-slate-500 text-sm mb-8">Every variant includes over 40 specification fields across eight categories.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚙️', title: 'Engine', fields: 'Displacement, cylinders, power (bhp/kW), torque, aspiration, fuel type' },
              { icon: '🏎️', title: 'Performance', fields: '0–100 km/h, top speed (kph & mph)' },
              { icon: '⛽', title: 'Fuel Economy', fields: 'Combined, urban, extra-urban (L/100km & MPG), CO₂ g/km, Euro standard' },
              { icon: '📐', title: 'Dimensions', fields: 'Length, width, height, wheelbase, kerb weight, boot capacity' },
              { icon: '🔧', title: 'Transmission', fields: 'Gearbox type, number of gears, drivetrain configuration' },
              { icon: '🚗', title: 'Body', fields: 'Body style, doors, seats, tyres, brakes' },
              { icon: '🔋', title: 'Electric/Hybrid', fields: 'Battery kWh, electric range, max charging rate' },
              { icon: '📊', title: 'History', fields: 'Full edit history with diffs — every change tracked' },
            ].map(item => (
              <div key={item.title} className="card p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.fields}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-950 rounded-xl p-8 md:p-12 text-white flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Vehicle Data API for Developers</h2>
            <p className="text-primary-300 text-sm mb-4">
              Query 30,000+ variants programmatically. JSON responses, key authentication, usage dashboard. £20/month flat rate.
            </p>
            <div className="bg-primary-900 rounded-lg p-3 font-mono text-xs text-primary-200 overflow-x-auto">
              <span className="text-slate-400">GET </span>/api/v1/variants?make=audi&amp;model=a3<br/>
              <span className="text-slate-400">Authorization: </span>Bearer cdw_...
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href="/api-docs" className="btn-accent block text-center px-6 py-3 text-base font-semibold rounded">
              View API Docs
            </Link>
            <p className="text-xs text-primary-400 text-center mt-2">£20/month · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <details key={i} className="card group">
              <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-slate-800 text-sm list-none">
                {item.q}
                <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
                </svg>
              </summary>
              <p className="px-4 pb-4 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
