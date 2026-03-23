import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Contribute Data — cardata.wiki',
  description: 'Help improve cardata.wiki by editing specs directly on any vehicle page, or uploading bulk CSV data. Free to contribute.',
  alternates: { canonical: 'https://cardata.wiki/contribute' },
}

export default async function ContributePage() {
  const session = await auth()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contribute to cardata.wiki</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          cardata.wiki gets better when people like you fix errors and fill in the gaps.
          Here&apos;s how to help.
        </p>
      </div>

      {/* Method 1: inline editing */}
      <section className="mb-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-800 font-bold text-lg">1</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Edit specs directly</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              The simplest way to contribute. Browse to any vehicle variant page, sign in,
              and you&apos;ll see edit pencil icons appear next to every spec field.
              Click a value, type the correct figure, and hit Save. Your change is logged
              in the revision history and immediately live on the page.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This is ideal for fixing a single wrong value — a misquoted power figure,
              an incorrect 0–100 time, a missing CO₂ rating. No spreadsheets, no forms,
              just click and fix.
            </p>
            <div className="flex gap-3">
              {session ? (
                <Link href="/makes" className="btn-primary">Browse vehicles to edit</Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary">Create a free account</Link>
                  <Link href="/login" className="btn-outline">Sign in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-slate-100 my-8" />

      {/* Method 2: CSV upload */}
      <section className="mb-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-800 font-bold text-lg">2</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Upload bulk CSV data</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Have a spreadsheet of spec data for a make, model range, or production year?
              Upload it as a CSV from your dashboard. Our AI pipeline analyses the submission
              for consistency, flags potential issues, and sends it to our admin team for review.
              Once approved, the data is merged into the main database.
            </p>

            {/* CSV format guide */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">CSV format</h3>
              <p className="text-xs text-slate-500 mb-2">
                Include a header row with any of the following columns (you don&apos;t need all of them):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {[
                  'make', 'model', 'variant', 'yearFrom', 'yearTo',
                  'enginePowerBhp', 'enginePowerKw', 'engineTorqueNm',
                  'engineDisplacement', 'engineFuelType', 'engineCylinders',
                  'gearboxType', 'gears', 'drivetrain',
                  'acceleration0100', 'topSpeedKph', 'topSpeedMph',
                  'fuelEconomyCombinedMpg', 'co2Gkm',
                  'lengthMm', 'widthMm', 'heightMm', 'weightKg',
                  'doors', 'seats', 'bodyType',
                ].map(col => (
                  <code key={col} className="text-xs font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                    {col}
                  </code>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Maximum file size: 10MB. Only .csv files accepted. By uploading, you confirm the
              data is yours to share and agree it will be published under CC BY 4.0.
            </p>

            <div className="flex gap-3">
              {session ? (
                <Link href="/dashboard/submissions" className="btn-primary">Go to my submissions</Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary">Create a free account</Link>
                  <Link href="/login"    className="btn-outline">Sign in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-slate-100 my-8" />

      {/* Guidelines */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Contribution guidelines</h2>
        <ul className="space-y-3 text-slate-600">
          {[
            { title: 'Use official sources where possible', body: 'Manufacturer press releases, owner\'s handbooks, and homologation documents are ideal. Avoid copying from sites that may themselves have errors.' },
            { title: 'Be precise with units', body: 'Power in bhp or kW, torque in Nm, economy in L/100km or mpg, dimensions in mm, weight in kg.' },
            { title: 'Don\'t invent data', body: 'Leave a field blank rather than guessing. A missing value is better than a wrong one.' },
            { title: 'No copyrighted data', body: 'Don\'t copy from proprietary databases, subscription services, or data that isn\'t yours to share.' },
            { title: 'All contributions are CC BY 4.0', body: 'Anything you submit is published under a Creative Commons licence and will be freely reusable by anyone.' },
          ].map(item => (
            <li key={item.title} className="flex gap-3">
              <svg className="flex-shrink-0 w-5 h-5 text-primary-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              <div>
                <span className="font-medium text-slate-800">{item.title}</span>
                {' — '}
                <span>{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <section className="border-t border-slate-200 pt-8">
        <p className="text-sm text-slate-500">
          Questions? Read our <Link href="/terms" className="text-primary-700 hover:underline">Terms of Service</Link> or
          {' '}<Link href="/about" className="text-primary-700 hover:underline">learn more about the project</Link>.
        </p>
      </section>

    </div>
  )
}
