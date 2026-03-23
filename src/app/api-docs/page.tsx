import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vehicle Data API Documentation',
  description: 'REST API for programmatic access to 30,000+ vehicle specifications. JSON responses, key authentication, £20/month flat rate. Code examples in JavaScript, Python, and PHP.',
}

const ENDPOINTS = [
  { method: 'GET', path: '/api/v1/makes',                      desc: 'List all makes',                            params: 'page, limit (max 200)' },
  { method: 'GET', path: '/api/v1/makes/:makeSlug',            desc: 'Single make with model count',              params: '—' },
  { method: 'GET', path: '/api/v1/variants',                   desc: 'List variants with filtering',              params: 'make, model, fuel, yearFrom, yearTo, page, limit' },
  { method: 'GET', path: '/api/v1/variants/:variantId',        desc: 'Full variant spec (all 40+ fields)',        params: '—' },
]

const JS_EXAMPLE = `const response = await fetch(
  'https://cardata.wiki/api/v1/variants?make=audi&fuel=DIESEL&limit=10',
  { headers: { 'Authorization': 'Bearer cdw_YOUR_API_KEY' } }
)
const { data, meta } = await response.json()
console.log(\`Found \${meta.total} variants\`)
data.forEach(v => console.log(v.name, v.enginePowerBhp + 'bhp'))`

const PYTHON_EXAMPLE = `import requests

headers = {'Authorization': 'Bearer cdw_YOUR_API_KEY'}
r = requests.get(
    'https://cardata.wiki/api/v1/variants',
    params={'make': 'bmw', 'yearFrom': 2020, 'limit': 50},
    headers=headers
)
variants = r.json()['data']
for v in variants:
    print(v['name'], v.get('enginePowerBhp'), 'bhp')`

const PHP_EXAMPLE = `$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://cardata.wiki/api/v1/variants?make=ford',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer cdw_YOUR_API_KEY'],
]);
$response = json_decode(curl_exec($ch), true);
foreach ($response['data'] as $variant) {
    echo $variant['name'] . PHP_EOL;
}`

const SAMPLE_RESPONSE = `{
  "data": [
    {
      "id": "clxxx123",
      "slug": "ford-focus-20-tdci-titanium-2019",
      "name": "2.0 TDCi Titanium",
      "make": "Ford",
      "model": "Focus",
      "yearFrom": 2019,
      "yearTo": null,
      "engineFuelType": "DIESEL",
      "enginePowerBhp": 148.0,
      "engineTorqueNm": 340.0,
      "acceleration0100": 8.9,
      "topSpeedKph": 213,
      "co2Gkm": 121,
      "fuelEconomyCombinedMpg": 60.1
    }
  ],
  "meta": { "page": 1, "limit": 50, "total": 832, "pages": 17 }
}`

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vehicle Data API</h1>
        <p className="text-slate-500">Programmatic access to 30,000+ vehicle specifications. REST, JSON, £20/month.</p>
        <div className="flex gap-3 mt-4">
          <Link href="/register" className="btn-primary">Get API key</Link>
          <Link href="/dashboard/billing" className="btn-outline">Subscribe — £20/mo</Link>
        </div>
      </div>

      {/* Authentication */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Authentication</h2>
        <p className="text-sm text-slate-600 mb-3">All API requests require a Bearer token in the Authorization header.</p>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-200 overflow-x-auto">
          <span className="text-slate-400">Authorization: </span>Bearer cdw_your_api_key_here
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Generate API keys from your <Link href="/dashboard/api-keys" className="text-primary-700 hover:underline">dashboard</Link> after subscribing.
        </p>
      </section>

      {/* Base URL */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Base URL</h2>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-primary-300">
          https://cardata.wiki
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Endpoints</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500 w-16">Method</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Path</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500">Description</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-slate-500 hidden md:table-cell">Query params</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ENDPOINTS.map(e => (
                <tr key={e.path}>
                  <td className="px-4 py-2">
                    <span className="badge badge-blue">{e.method}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-700">{e.path}</td>
                  <td className="px-4 py-2 text-slate-600">{e.desc}</td>
                  <td className="px-4 py-2 text-xs text-slate-400 font-mono hidden md:table-cell">{e.params}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sample response */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Example Response</h2>
        <p className="text-sm text-slate-500 mb-2">GET /api/v1/variants?make=ford&amp;limit=1</p>
        <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-200 overflow-x-auto">{SAMPLE_RESPONSE}</pre>
      </section>

      {/* Code examples */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Code Examples</h2>
        <div className="space-y-4">
          {[
            { lang: 'JavaScript', code: JS_EXAMPLE },
            { lang: 'Python',     code: PYTHON_EXAMPLE },
            { lang: 'PHP',        code: PHP_EXAMPLE },
          ].map(ex => (
            <div key={ex.lang}>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">{ex.lang}</h3>
              <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-200 overflow-x-auto">{ex.code}</pre>
            </div>
          ))}
        </div>
      </section>

      {/* Fuel type enums */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Fuel Type Values</h2>
        <div className="flex flex-wrap gap-2">
          {['PETROL','DIESEL','ELECTRIC','HYBRID_PETROL','HYBRID_DIESEL','PLUG_IN_HYBRID','HYDROGEN','LPG'].map(f => (
            <code key={f} className="badge badge-grey font-mono">{f}</code>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-primary-950 text-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to get started?</h2>
        <p className="text-primary-300 text-sm mb-4">£20/month · REST API · cancel anytime</p>
        <Link href="/register" className="btn-accent inline-flex px-6 py-2.5 text-base font-semibold">
          Create account & subscribe
        </Link>
      </div>
    </div>
  )
}
