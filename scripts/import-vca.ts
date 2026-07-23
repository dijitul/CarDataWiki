/**
 * CarDataWiki — VCA (Vehicle Certification Agency) Importer
 *
 * Official UK car fuel & emissions data, Crown copyright (Open Government Licence).
 * Source: https://carfueldata.vehicle-certification-agency.gov.uk/
 *
 * Downloads the "latest" dataset (cars currently on sale, WLTP) and upserts
 * variants. The endpoints need a session cookie, so we GET the downloads page
 * first with a cookie jar.
 *
 * Run: npx tsx scripts/import-vca.ts            (latest data)
 *      npx tsx scripts/import-vca.ts <file.csv> (pre-downloaded CSV, same layout)
 */

import { execSync } from 'child_process'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import Papa from 'papaparse'
import { PrismaClient, FuelType, GearboxType, Prisma } from '@prisma/client'
import { makeSlug, modelSlug, variantSlug } from '../src/lib/slugify'

const prisma = new PrismaClient()
const TMP = join(tmpdir(), 'vca-import')
const BASE = 'https://carfueldata.vehicle-certification-agency.gov.uk'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CarDataWiki-importer'

function download(): string {
  if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true })
  const jar = join(TMP, 'cookies.txt')
  const zip = join(TMP, 'vca-latest.zip')
  const csv = join(TMP, 'Euro_6_latest.csv')
  console.log('📥 Downloading VCA latest dataset…')
  execSync(`curl -s -c "${jar}" -A "${UA}" "${BASE}/downloads/default.aspx" -o nul`, { shell: 'cmd.exe' })
  execSync(`curl -s -b "${jar}" -A "${UA}" -e "${BASE}/downloads/default.aspx" -L "${BASE}/downloads/create_latest_data_csv.asp?id=6" -o "${zip}"`, { shell: 'cmd.exe' })
  const tar = process.platform === 'win32' ? `${process.env.SystemRoot}\\System32\\tar.exe` : 'tar'
  execSync(`"${tar}" -xf "${zip}" -C "${TMP}"`)
  return csv
}

// "ABARTH" → "Abarth", "LAND ROVER" → "Land Rover", keep "BMW"/"MG"/"DS" upper
const KEEP_UPPER = new Set(['BMW', 'MG', 'DS', 'BYD', 'KGM', 'GWM', 'MAN', 'SEAT', 'INEOS', 'LEVC', 'MINI'])
function titleCase(s: string): string {
  const t = s.trim()
  if (KEEP_UPPER.has(t.toUpperCase())) return t.toUpperCase() === 'SEAT' ? 'SEAT' : t.toUpperCase()
  return t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\bMercedes-benz\b/i, 'Mercedes-Benz')
}

function mapFuel(fuelType: string, powertrain: string): FuelType | null {
  const f = fuelType.toLowerCase(), p = powertrain.toLowerCase()
  if (f.includes('electricity') && !p.includes('hybrid')) return 'ELECTRIC'
  if (p.includes('plug-in')) return 'PLUG_IN_HYBRID'
  if (p.includes('hybrid')) return f.includes('diesel') ? 'HYBRID_DIESEL' : 'HYBRID_PETROL'
  if (f.includes('diesel')) return 'DIESEL'
  if (f.includes('petrol')) return 'PETROL'
  if (f.includes('hydrogen')) return 'HYDROGEN'
  if (f.includes('lpg')) return 'LPG'
  if (f.includes('electricity')) return 'ELECTRIC'
  return null
}

// Transmission codes: M6 → MANUAL/6, A8 → AUTOMATIC/8, A1 (EV single-speed) → AUTOMATIC
function mapTransmission(code: string, manualOrAuto: string): { g: GearboxType | null; n: number | null } {
  const m = code.trim().match(/^([MA])(\d{1,2})?/i)
  if (!m) {
    const moa = manualOrAuto.toLowerCase()
    if (moa.startsWith('man')) return { g: 'MANUAL', n: null }
    if (moa.startsWith('auto') || moa.includes('electric')) return { g: 'AUTOMATIC', n: null }
    return { g: null, n: null }
  }
  return { g: m[1].toUpperCase() === 'M' ? 'MANUAL' : 'AUTOMATIC', n: m[2] ? Number(m[2]) : null }
}

const num = (v: unknown): number | null => {
  if (v === null || v === undefined) return null
  const n = Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) && n !== 0 ? n : null
}
const dec = (v: unknown) => (num(v) === null ? null : new Prisma.Decimal(num(v)!))

async function main() {
  const csvPath = process.argv[2] ?? download()
  const raw = readFileSync(csvPath, 'utf8')
  const { data } = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: true })
  console.log(`📄 ${data.length} rows`)

  let created = 0, enriched = 0, unchanged = 0, skipped = 0
  const makeCache = new Map<string, string>()
  const modelCache = new Map<string, string>()

  for (const row of data) {
    const mfr = row['Manufacturer']?.trim()
    let modelName = row['Model']?.trim()
    const desc = row['Description']?.trim()
    if (!mfr || !modelName || !desc) { skipped++; continue }

    // "500e MY25" → model "500e", yearFrom 2025
    let yearFrom: number | null = null
    const my = modelName.match(/\bMY(\d{2})\b/)
    if (my) { yearFrom = 2000 + Number(my[1]); modelName = modelName.replace(/\s*\bMY\d{2}\b/, '').trim() }

    const makeName = titleCase(mfr)
    let makeId = makeCache.get(makeName)
    if (!makeId) {
      const mk = await prisma.make.upsert({
        where: { slug: makeSlug(makeName) }, update: {}, create: { name: makeName, slug: makeSlug(makeName) },
      })
      makeId = mk.id; makeCache.set(makeName, makeId)
    }

    const mKey = `${makeId}|${modelName.toLowerCase()}`
    let modelId = modelCache.get(mKey)
    if (!modelId) {
      const mSlug = modelSlug(makeName, modelName)
      const bySlug = await prisma.model.findUnique({ where: { slug: mSlug } })
      const mo = bySlug && bySlug.makeId === makeId
        ? bySlug
        : await prisma.model.upsert({
            where: { makeId_name: { makeId, name: modelName } },
            update: {},
            create: { makeId, name: modelName, slug: bySlug ? `${mSlug}-2` : mSlug },
          })
      modelId = mo.id; modelCache.set(mKey, modelId)
    }

    const variantName = my ? `${desc} MY${my[1]}` : desc
    let slug = variantSlug(makeName, modelName, variantName)
    const trans = mapTransmission(row['Transmission'] ?? '', row['Manual or Automatic'] ?? '')
    const fuel = mapFuel(row['Fuel Type'] ?? '', row['Powertrain'] ?? '')
    const isEv = fuel === 'ELECTRIC'
    const ps = num(row['Engine Power (PS)'])

    const fields = {
      yearFrom,
      engineDisplacement: num(row['Engine Capacity']) === null ? null : Math.round(num(row['Engine Capacity'])!),
      engineFuelType: fuel,
      enginePowerKw: dec(row['Engine Power (Kw)']),
      enginePowerBhp: ps === null ? null : new Prisma.Decimal(Math.round(ps * 0.98632 * 10) / 10),
      gearboxType: trans.g,
      gears: trans.n,
      fuelEconomyCombinedMpg: dec(row['WLTP Imperial Combined'] ?? row['WLTP Imperial Combined (Weighted)']),
      fuelEconomyCombinedL100: dec(row['WLTP Metric Combined'] ?? row['WLTP Metric Combined (Weighted)']),
      co2Gkm: num(row['WLTP CO2']) ?? num(row['WLTP CO2 Weighted']),
      emissionsStandard: row['Euro Standard']?.trim() || null,
      noxMgkm: dec(row['Emissions NOx [mg/km]']),
      electricRangeKm: isEv
        ? num(row['Maximum range (Km)']) === null ? null : Math.round(num(row['Maximum range (Km)'])!)
        : num(row['Equivalent All Electric Range KM']) === null ? null : Math.round(num(row['Equivalent All Electric Range KM'])!),
    }

    const existing = await prisma.modelVariant.findUnique({ where: { slug } })
    if (existing) {
      if (existing.modelId !== modelId) { skipped++; continue }
      const patch: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(fields)) {
        if (v !== null && (existing as Record<string, unknown>)[k] === null) patch[k] = v
      }
      if (Object.keys(patch).length) { await prisma.modelVariant.update({ where: { slug }, data: patch }); enriched++ }
      else unchanged++
    } else {
      await prisma.modelVariant.create({ data: { modelId, name: variantName, slug, ...fields } })
      created++
    }
  }

  console.log(`\n✅ VCA import done. Created: ${created}, enriched: ${enriched}, unchanged: ${unchanged}, skipped: ${skipped}`)
  console.log('   Attribution: Contains public sector information licensed under the Open Government Licence v3.0 (VCA).')
}

main().finally(() => prisma.$disconnect())
