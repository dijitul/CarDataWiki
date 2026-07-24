import Link from 'next/link'
import type { Metadata } from 'next'
import { getSiteCounts } from '@/lib/stats'

export const metadata: Metadata = {
  title: 'About cardata.wiki — Free Community Car Specifications Database',
  description: 'cardata.wiki is a free, open, community-maintained database of vehicle technical specifications. Built for researchers, developers, and enthusiasts.',
  alternates: { canonical: 'https://cardata.wiki/about' },
}

export default async function AboutPage() {
  const counts = await getSiteCounts()
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          About cardata.wiki
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A free, open, community-maintained database of vehicle technical specifications —
          built for anyone who needs reliable car data and doesn&apos;t want to pay for it.
        </p>
      </div>

      {/* What it is */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What is cardata.wiki?</h2>
        <div className="prose-like space-y-4 text-slate-600 leading-relaxed">
          <p>
            cardata.wiki is a Wikipedia-style database of car specifications. We cover
            engine data, performance figures, dimensions, fuel economy, emissions,
            drivetrain configurations, and more — for over {counts.variants.toLocaleString()} vehicle
            variants across {counts.makes.toLocaleString()} manufacturers.
          </p>
          <p>
            The data is free. Not free-with-a-catch, not free-for-personal-use-only. Genuinely
            free, for any purpose, under a{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="text-primary-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons CC BY 4.0
            </a>{' '}
            licence. Download it as a CSV, call it through our API, embed it in your app,
            use it for research — whatever you need.
          </p>
          <p>
            Think of it as the missing open-source alternative to expensive automotive
            data providers. Whether you&apos;re building a comparison tool, writing a university
            dissertation, powering a car-finding app, or just satisfying your curiosity about
            the 0–100 time on a 1998 Audi A3 — this is for you.
          </p>
        </div>
      </section>

      {/* Community */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Community-driven data</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Like Wikipedia, cardata.wiki relies on its community to grow and stay accurate.
            Anyone can create a free account and edit or add specifications directly on any
            vehicle page. All edits are tracked with a full revision history, so nothing is
            ever lost and errors can always be corrected.
          </p>
          <p>
            Want to contribute larger datasets? Registered users can also upload CSV files
            with bulk spec data. Our AI-assisted review pipeline analyses submissions for
            consistency and quality before a human administrator approves them. It&apos;s designed
            to make contributing easy while maintaining data integrity.
          </p>
          <p>
            We seed the database from public domain and openly-licensed sources, and the
            community takes it from there. If you spot something wrong, please fix it —
            that&apos;s how this works.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/register" className="btn-primary">Create a free account</Link>
          <Link href="/contribute" className="btn-outline">How to contribute</Link>
        </div>
      </section>

      {/* API */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">The API</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            We offer a developer API at £20/month. That price exists for one reason only:
            to cover our hosting and infrastructure costs. We&apos;re not trying to monetise the
            data — the data itself is and always will be free to browse and download manually.
          </p>
          <p>
            The API gives developers programmatic access to the full dataset with clean,
            structured JSON responses. It&apos;s useful if you&apos;re building something that needs
            live, queryable car data without managing your own database.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/api-docs" className="btn-outline">View API documentation</Link>
        </div>
      </section>

      {/* Built by */}
      <section className="mb-10 bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Built by</h2>
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>
            cardata.wiki was designed and built by{' '}
            <a
              href="https://dijitul.uk"
              className="text-primary-700 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Olly at dijitul
            </a>
            {' '}— a digital agency based in the UK. The engineering, architecture,
            and much of the writing on this site was produced with significant assistance
            from{' '}
            <a
              href="https://www.anthropic.com/claude"
              className="text-primary-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude
            </a>
            , an AI assistant made by Anthropic. We think it&apos;s important to be upfront
            about that — AI was a genuine collaborator here, not just a spell-checker.
          </p>
          <p>
            This project exists because we got tired of car data being locked behind
            expensive APIs and proprietary databases. The manufacturers publish the specs.
            The specs are facts. Facts should be free.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">By the numbers</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: counts.makes.toLocaleString(),    label: 'Manufacturers' },
            { value: counts.models.toLocaleString(),    label: 'Models' },
            { value: counts.variants.toLocaleString(),  label: 'Spec entries' },
          ].map(stat => (
            <div key={stat.label} className="card p-5 text-center">
              <div className="text-3xl font-bold text-primary-800 font-mono">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer links */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">More information</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/terms"      className="text-primary-700 hover:underline">Terms of Service</Link>
          <Link href="/privacy"    className="text-primary-700 hover:underline">Privacy Policy</Link>
          <Link href="/api-docs"   className="text-primary-700 hover:underline">API Documentation</Link>
          <Link href="/contribute" className="text-primary-700 hover:underline">Contribute Data</Link>
          <a
            href="https://dijitul.uk"
            className="text-primary-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            dijitul.uk
          </a>
        </div>
      </section>

    </div>
  )
}
