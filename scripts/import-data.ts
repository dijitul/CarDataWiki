/**
 * CarDataWiki — Data Import Script
 *
 * Downloads automobiles.csv.zip from:
 *   https://github.com/ilyasozkurt/automobile-models-and-specs
 *
 * Extracts 3 CSVs:
 *   brands.csv      — id, url_hash, url, name, logo, ...
 *   automobiles.csv — id, url_hash, url, brand_id, name, description, ...
 *   engines.csv     — id, other_id, automobile_id, name, specs (JSON), ...
 *
 * Run: npm run import:data
 */

import { execSync }              from 'child_process'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join }                  from 'path'
import { PrismaClient, FuelType, GearboxType, DrivetrainType } from '@prisma/client'
import { slugify }               from '../src/lib/slugify'

const prisma    = new PrismaClient()
const TMP_DIR   = '/tmp/cardata-import'
const ZIP_URL   = 'https://raw.githubusercontent.com/ilyasozkurt/automobile-models-and-specs/master/automobiles.csv.zip'
const ZIP_FILE  = join(TMP_DIR, 'automobiles.csv.zip')

// ─── Download & extract ───────────────────────────────────────────────────────

function setup() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true })
  if (!existsSync(join(TMP_DIR, 'engines.csv'))) {
    console.log('📥 Downloading data zip (~50MB)…')
    execSync(`curl -sL "${ZIP_URL}" -o "${ZIP_FILE}"`)
    console.log('📦 Extracting…')
    execSync(`unzip -o "${ZIP_FILE}" -d "${TMP_DIR}"`)
    console.log('✅ Extracted\n')
  } else {
    console.log('✅ Files already extracted, skipping download\n')
  }
}

// ─── Simple CSV row parser ────────────────────────────────────────────────────
// Handles quoted fields with embedded commas and escaped quotes.

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { field += '"'; i++ }
      else if (ch === '"') { inQuotes = false }
      else { field += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { fields.push(field); field = '' }
      else { field += ch }
    }
  }
  fields.push(field)
  return fields
}

function parseCsv(filePath: string): Record<string, string>[] {
  const raw   = readFileSync(filePath, 'utf8')
  // Split by newlines but be careful about embedded newlines in quoted fields
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (ch === '"') {
      if (inQuotes && raw[i + 1] === '"') { current += '""'; i++ }
      else { inQuotes = !inQuotes; current += ch }
    } else if (ch === '\n' && !inQuotes) {
      if (current.trim()) lines.push(current.replace(/\r$/, ''))
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) lines.push(current.replace(/\r$/, ''))

  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

// ─── Value parsers ────────────────────────────────────────────────────────────

function extractMm(val: string | undefined): number | null {
  if (!val) return null
  // e.g. "183.5 In (4661 Mm)" or "4661 mm"
  const mm = val.match(/\((\d+)\s*[Mm][Mm]\)/)?.[1] ?? val.match(/^(\d+)\s*[Mm][Mm]/)?.[1]
  return mm ? parseInt(mm) : null
}

function extractKg(val: string | undefined): number | null {
  if (!val) return null
  // e.g. "3560 Lbs (1615 Kg)"
  const kg = val.match(/\((\d+)\s*[Kk][Gg]\)/)?.[1] ?? val.match(/^(\d+)\s*[Kk][Gg]/)?.[1]
  return kg ? parseInt(kg) : null
}

function extractLitres(val: string | undefined): number | null {
  if (!val) return null
  // e.g. "17.7 Cuft (501 L)" or "90.1 L"
  const l = val.match(/\([\d.]+\s*[Ll]\)/)?.[0]?.match(/[\d.]+/)?.[0]
          ?? val.match(/([\d.]+)\s*[Ll]\b/)?.[1]
  return l ? parseFloat(l) : null
}

function extractKph(val: string | undefined): number | null {
  if (!val) return null
  // e.g. "155 Mph (249 Km/H)"
  const kph = val.match(/\((\d+)\s*[Kk][Mm]\/[Hh]\)/)?.[1]
           ?? val.match(/(\d+)\s*[Kk][Mm]\/[Hh]/)?.[1]
  return kph ? parseInt(kph) : null
}

function extractMph(val: string | undefined): number | null {
  if (!val) return null
  const mph = val.match(/^(\d+)\s*[Mm][Pp][Hh]/)?.[1]
  return mph ? parseInt(mph) : null
}

function extractSec(val: string | undefined): number | null {
  if (!val) return null
  const s = val.match(/([\d.]+)\s*[Ss]\b/)?.[1]
  return s ? parseFloat(s) : null
}

function extractKw(val: string | undefined): number | null {
  if (!val) return null
  const line = val.split('\n')[0]
  const kw = line.match(/([\d.]+)\s*[Kk][Ww]/)?.[1]
  return kw ? parseFloat(kw) : null
}

function extractBhp(val: string | undefined): number | null {
  if (!val) return null
  // e.g. "257.4 Kw @ 6500 Rpm\n350 Hp @ 6500 Rpm\n345 Bhp @ 6500 Rpm"
  const bhp = val.match(/([\d.]+)\s*[Bb][Hh][Pp]/)?.[1]
           ?? val.match(/([\d.]+)\s*[Pp][Ss]/)?.[1]
           ?? val.match(/([\d.]+)\s*[Hh][Pp]/)?.[1]
  return bhp ? parseFloat(bhp) : null
}

function extractNm(val: string | undefined): number | null {
  if (!val) return null
  const nm = val.match(/([\d.]+)\s*[Nn][Mm]/)?.[1]
  return nm ? parseFloat(nm) : null
}

function extractCc(val: string | undefined): number | null {
  if (!val) return null
  const cc = val.match(/([\d.]+)\s*[Cc][Mm]3/)?.[1]
           ?? val.match(/([\d.]+)\s*[Cc][Cc]/)?.[1]
  return cc ? parseFloat(cc) : null
}

function extractL100(val: string | undefined): number | null {
  if (!val) return null
  const l = val.match(/([\d.]+)\s*[Ll]\/100/)?.[1]
  return l ? parseFloat(l) : null
}

function extractMpg(val: string | undefined): number | null {
  if (!val) return null
  const mpg = val.match(/([\d.]+)\s*[Mm][Pp][Gg]/)?.[1]
  return mpg ? parseFloat(mpg) : null
}

function parseFuel(val: string | undefined): FuelType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('plug') || v.includes('phev'))     return FuelType.PLUG_IN_HYBRID
  if (v.includes('electric') && v.includes('gas'))  return FuelType.HYBRID_PETROL
  if (v.includes('electric') && v.includes('dies')) return FuelType.HYBRID_DIESEL
  if (v.includes('electric'))                       return FuelType.ELECTRIC
  if (v.includes('diesel'))                         return FuelType.DIESEL
  if (v.includes('hydrogen'))                       return FuelType.HYDROGEN
  if (v.includes('lpg') || v.includes('autogas'))   return FuelType.LPG
  if (v.includes('gas') || v.includes('petrol') || v.includes('benzin')) return FuelType.PETROL
  return null
}

function parseGearbox(val: string | undefined): GearboxType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('cvt'))                      return GearboxType.CVT
  if (v.includes('dct') || v.includes('dsg') || v.includes('pdk') || v.includes('dual-clutch')) return GearboxType.DCT
  if (v.includes('semi') || v.includes('automated manual')) return GearboxType.SEMI_AUTOMATIC
  if (v.includes('auto'))                     return GearboxType.AUTOMATIC
  if (v.includes('manual') || v.includes('mt')) return GearboxType.MANUAL
  return null
}

function parseDrivetrain(val: string | undefined): DrivetrainType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('4wd') || v.includes('four-wheel') || v.includes('4x4')) return DrivetrainType.FOUR_WD
  if (v.includes('awd') || v.includes('all-wheel'))    return DrivetrainType.AWD
  if (v.includes('rear'))                              return DrivetrainType.RWD
  if (v.includes('front'))                             return DrivetrainType.FWD
  return null
}

function extractGears(gearbox: string | undefined): number | null {
  if (!gearbox) return null
  const m = gearbox.match(/^(\d+)/)?.[1]
  return m ? parseInt(m) : null
}

function extractCylinders(val: string | undefined): number | null {
  if (!val) return null
  const v = val.toUpperCase()
  if (v.startsWith('V')) { const n = v.match(/^V(\d+)/)?.[1]; if (n) return parseInt(n) }
  if (v.startsWith('W')) { const n = v.match(/^W(\d+)/)?.[1]; if (n) return parseInt(n) }
  if (v.includes('INLINE') || v.startsWith('I')) { const n = v.match(/(\d+)/)?.[1]; if (n) return parseInt(n) }
  if (v.startsWith('FLAT') || v.startsWith('BOXER')) { const n = v.match(/(\d+)/)?.[1]; if (n) return parseInt(n) }
  const fallback = v.match(/(\d+)/)?.[1]
  return fallback ? parseInt(fallback) : null
}

// ─── Model name cleaner ───────────────────────────────────────────────────────

function cleanModelName(rawName: string, brandName: string): { name: string; yearFrom: number | null; yearTo: number | null } {
  let n = rawName
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/Photos,\s*engines.*$/i, '')
    .replace(/Photos.*$/i, '')
    .replace(/Specs.*$/i, '')
    .trim()

  // Remove leading brand name
  if (n.toLowerCase().startsWith(brandName.toLowerCase())) {
    n = n.slice(brandName.length).trim()
  }

  // Extract years e.g. "1998-2000" or "1998-Present" or "2020"
  let yearFrom: number | null = null
  let yearTo:   number | null = null
  const yearMatch = n.match(/\b((?:19|20)\d{2})\s*[-–]\s*((?:19|20)\d{2}|[Pp]resent|[Nn]ow|[Cc]urrent)?\b/)
  if (yearMatch) {
    yearFrom = parseInt(yearMatch[1])
    if (yearMatch[2] && /\d/.test(yearMatch[2])) yearTo = parseInt(yearMatch[2])
    n = n.replace(yearMatch[0], '').trim()
  } else {
    const singleYear = n.match(/\b((?:19|20)\d{2})\b/)
    if (singleYear) {
      yearFrom = parseInt(singleYear[1])
      n = n.replace(singleYear[0], '').trim()
    }
  }

  // Clean trailing punctuation/spaces
  n = n.replace(/\s+/g, ' ').replace(/^[-–\s]+|[-–\s]+$/g, '').trim()

  return { name: n || rawName.split(' ').slice(0, 3).join(' '), yearFrom, yearTo }
}

// ─── Spec JSON parser ─────────────────────────────────────────────────────────

interface EngineSpecs {
  engineDisplacement?: number | null
  engineCylinders?:    number | null
  engineFuelType?:     FuelType | null
  enginePowerKw?:      number | null
  enginePowerBhp?:     number | null
  engineTorqueNm?:     number | null
  gearboxType?:        GearboxType | null
  gears?:              number | null
  drivetrain?:         DrivetrainType | null
  acceleration0100?:   number | null
  topSpeedKph?:        number | null
  topSpeedMph?:        number | null
  fuelEconomyUrbanL100?:      number | null
  fuelEconomyExtraUrbanL100?: number | null
  fuelEconomyCombinedL100?:   number | null
  fuelEconomyCombinedMpg?:    number | null
  fuelTankLitres?:     number | null
  lengthMm?:           number | null
  widthMm?:            number | null
  heightMm?:           number | null
  wheelbaseMm?:        number | null
  weightKg?:           number | null
  bootLitres?:         number | null
  tyreFront?:          string | null
  brakeFront?:         string | null
  brakeRear?:          string | null
}

function parseSpecs(raw: string): EngineSpecs {
  let json: Record<string, Record<string, string>>
  try { json = JSON.parse(raw) } catch { return {} }

  const eng  = json['Engine Specs']        ?? {}
  const perf = json['Performance Specs']   ?? {}
  const trans= json['Transmission Specs']  ?? {}
  const brk  = json['Brakes Specs']        ?? {}
  const tyre = json['Tires Specs']         ?? {}
  const dim  = json['Dimensions']          ?? {}
  const wt   = json['Weight Specs']        ?? {}
  const fuelE= json['Fuel Economy (Nedc)'] ?? json['Fuel Economy (Wltp)'] ?? json['Fuel Economy'] ?? {}

  const gearboxRaw = trans['Gearbox:'] ?? trans['Gearbox'] ?? ''

  // Top speed — try "155 Mph (249 Km/H)"
  const topSpeedRaw = perf['Top Speed:'] ?? perf['Top Speed'] ?? ''

  // Fuel economy keys vary — city, highway, combined
  const cityRaw     = fuelE['City:']     ?? fuelE['City']     ?? ''
  const highwayRaw  = fuelE['Highway:']  ?? fuelE['Highway']  ?? ''
  const combinedRaw = fuelE['Combined:'] ?? fuelE['Combined'] ?? ''

  return {
    engineDisplacement: extractCc(eng['Displacement:'] ?? eng['Displacement']),
    engineCylinders:    extractCylinders(eng['Cylinders:'] ?? eng['Cylinders']),
    engineFuelType:     parseFuel(eng['Fuel:'] ?? eng['Fuel'] ?? eng['Fuel Type:'] ?? eng['Fuel Type']),
    enginePowerKw:      extractKw(eng['Power:']   ?? eng['Power']),
    enginePowerBhp:     extractBhp(eng['Power:']  ?? eng['Power']),
    engineTorqueNm:     extractNm(eng['Torque:']  ?? eng['Torque']),
    gearboxType:        parseGearbox(gearboxRaw),
    gears:              extractGears(gearboxRaw),
    drivetrain:         parseDrivetrain(trans['Drive Type:'] ?? trans['Drive Type'] ?? trans['Drive Wheels:'] ?? trans['Drive Wheels']),
    acceleration0100:   extractSec(perf['Acceleration 0-62 Mph (0-100 Kph):'] ?? perf['Acceleration 0-100 Km/H:'] ?? perf['0-100 km/h:']),
    topSpeedKph:        extractKph(topSpeedRaw),
    topSpeedMph:        extractMph(topSpeedRaw),
    fuelEconomyUrbanL100:      extractL100(cityRaw),
    fuelEconomyExtraUrbanL100: extractL100(highwayRaw),
    fuelEconomyCombinedL100:   extractL100(combinedRaw) ?? (cityRaw && highwayRaw ? null : null),
    fuelEconomyCombinedMpg:    extractMpg(combinedRaw) ?? extractMpg(cityRaw),
    fuelTankLitres:     extractLitres(eng['Fuel Capacity:'] ?? eng['Fuel Capacity']),
    lengthMm:           extractMm(dim['Length:']    ?? dim['Length']),
    widthMm:            extractMm(dim['Width:']     ?? dim['Width']),
    heightMm:           extractMm(dim['Height:']    ?? dim['Height']),
    wheelbaseMm:        extractMm(dim['Wheelbase:'] ?? dim['Wheelbase']),
    weightKg:           extractKg(wt['Unladen Weight:'] ?? wt['Unladen Weight'] ?? wt['Curb Weight:'] ?? wt['Curb Weight']),
    bootLitres:         extractLitres(dim['Cargo Volume:'] ?? dim['Cargo Volume']),
    tyreFront:          tyre['Tire Size:'] ?? tyre['Tire Size'] ?? null,
    brakeFront:         brk['Front:'] ?? brk['Front'] ?? null,
    brakeRear:          brk['Rear:']  ?? brk['Rear']  ?? null,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚗 CarDataWiki — Data Import')
  console.log('━'.repeat(50))

  setup()

  // 1. Load brands (small file — fine to load all)
  console.log('📋 Loading brands…')
  const brandRows = parseCsv(join(TMP_DIR, 'brands.csv'))
  // brands.csv real columns: id, url_hash, url, name, logo, created_at, updated_at
  const brandMap = new Map<string, { name: string; logo: string }>()
  for (const row of brandRows) {
    const id   = row['id']?.trim()
    const name = (row['name'] ?? row['url_hash'] ?? '').trim()  // 'name' header col
    const logo = (row['logo'] ?? row['url'] ?? '').trim()
    if (id && name && name.length < 50) brandMap.set(id, { name, logo })
  }
  console.log(`   Found ${brandMap.size} brands`)

  // 2. Load automobiles (use column positions since header is misaligned)
  console.log('🚘 Loading automobile models…')
  const autoLines  = readFileSync(join(TMP_DIR, 'automobiles.csv'), 'utf8').split('\n')
  // actual columns: [0]=id, [1]=url_hash, [2]=url, [3]=brand_id, [4]=name, ...
  const autoMap = new Map<string, { brandId: string; name: string }>()
  for (let i = 1; i < autoLines.length; i++) {
    if (!autoLines[i].trim()) continue
    const cols = parseCsvLine(autoLines[i])
    const id      = cols[0]?.trim()
    const brandId = cols[3]?.trim()
    const name    = cols[4]?.trim()
    if (id && brandId && name) autoMap.set(id, { brandId, name })
  }
  console.log(`   Found ${autoMap.size} models`)

  // 3. Process engines line-by-line (large file)
  console.log('⚙️  Importing engine variants…')
  const engLines = readFileSync(join(TMP_DIR, 'engines.csv'), 'utf8').split('\n')
  // columns: id, other_id, automobile_id, name, specs, created_at, updated_at

  let makeCount = 0, modelCount = 0, variantCount = 0, skipped = 0
  const makeCache  = new Map<string, string>()  // slug -> id
  const modelCache = new Map<string, string>()  // slug -> id

  for (let i = 1; i < engLines.length; i++) {
    const line = engLines[i]
    if (!line.trim()) continue

    const cols      = parseCsvLine(line)
    const autoId    = cols[2]?.trim()
    const engName   = cols[3]?.trim()
    const specsRaw  = cols[4]?.trim()

    if (!autoId || !engName) { skipped++; continue }

    const auto = autoMap.get(autoId)
    if (!auto) { skipped++; continue }

    const brand = brandMap.get(auto.brandId)
    if (!brand) { skipped++; continue }

    const makeName  = brand.name
    const makeSlugV = slugify(makeName)

    // Upsert make
    let makeId = makeCache.get(makeSlugV)
    if (!makeId) {
      const make = await prisma.make.upsert({
        where:  { slug: makeSlugV },
        update: {},
        create: { name: makeName, slug: makeSlugV, logoUrl: brand.logo || null },
      })
      makeId = make.id
      makeCache.set(makeSlugV, makeId)
      makeCount++
    }

    // Clean model name
    const { name: cleanName, yearFrom, yearTo } = cleanModelName(auto.name, makeName)
    const modelSlugV = slugify(`${makeName}-${cleanName}`)

    // Upsert model
    let modelId = modelCache.get(modelSlugV)
    if (!modelId) {
      const model = await prisma.model.upsert({
        where:  { slug: modelSlugV },
        update: {},
        create: { makeId, name: cleanName, slug: modelSlugV },
      })
      modelId = model.id
      modelCache.set(modelSlugV, modelId)
      modelCount++
    }

    // Parse specs
    const specs = specsRaw ? parseSpecs(specsRaw) : {}

    // Build variant slug — use engine name which is specific enough
    const varSlug = slugify(`${makeName}-${cleanName}-${engName}`)

    try {
      await prisma.modelVariant.upsert({
        where:  { slug: varSlug },
        update: {},
        create: {
          modelId,
          name:    engName,
          slug:    varSlug,
          yearFrom: yearFrom ?? null,
          yearTo:   yearTo   ?? null,
          ...specs,
        },
      })
      variantCount++
    } catch {
      skipped++
    }

    // Progress
    if (variantCount % 500 === 0) {
      process.stdout.write(`\r   Variants: ${variantCount} | Skipped: ${skipped}     `)
    }
  }

  console.log('\n\n' + '━'.repeat(50))
  console.log('✅ Import complete:')
  console.log(`   Makes:    ${makeCount}`)
  console.log(`   Models:   ${modelCount}`)
  console.log(`   Variants: ${variantCount}`)
  console.log(`   Skipped:  ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
