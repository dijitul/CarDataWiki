/**
 * Data import script — pulls vehicle data from:
 * https://github.com/ilyasozkurt/automobile-models-and-specs
 *
 * Run with: npm run import:data
 *
 * The repo provides JSON files organised as:
 *   /brands.json          — list of all makes
 *   /models/{brand}.json  — models for each brand
 *   /specs/{model}.json   — specs for each model variant
 */

import { PrismaClient, FuelType, GearboxType, DrivetrainType } from '@prisma/client'
import { slugify, modelSlug, variantSlug } from '../src/lib/slugify'

const prisma = new PrismaClient()

const BASE_URL = 'https://raw.githubusercontent.com/ilyasozkurt/automobile-models-and-specs/master'

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json()
}

// ── Type helpers ────────────────────────────────────────────────────────────

function parseFuelType(val: string | undefined): FuelType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('electric') && v.includes('petrol')) return FuelType.HYBRID_PETROL
  if (v.includes('electric') && v.includes('diesel')) return FuelType.HYBRID_DIESEL
  if (v.includes('plug') || v.includes('phev')) return FuelType.PLUG_IN_HYBRID
  if (v.includes('electric')) return FuelType.ELECTRIC
  if (v.includes('diesel')) return FuelType.DIESEL
  if (v.includes('hydrogen')) return FuelType.HYDROGEN
  if (v.includes('lpg') || v.includes('gas')) return FuelType.LPG
  if (v.includes('petrol') || v.includes('gasoline') || v.includes('benzin')) return FuelType.PETROL
  return null
}

function parseGearbox(val: string | undefined): GearboxType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('cvt')) return GearboxType.CVT
  if (v.includes('dct') || v.includes('dual') || v.includes('dsg') || v.includes('pdk')) return GearboxType.DCT
  if (v.includes('semi')) return GearboxType.SEMI_AUTOMATIC
  if (v.includes('auto')) return GearboxType.AUTOMATIC
  if (v.includes('manual') || v.includes('man')) return GearboxType.MANUAL
  return null
}

function parseDrivetrain(val: string | undefined): DrivetrainType | null {
  if (!val) return null
  const v = val.toLowerCase()
  if (v.includes('4wd') || v.includes('four') || v === '4x4') return DrivetrainType.FOUR_WD
  if (v.includes('awd') || v.includes('all')) return DrivetrainType.AWD
  if (v.includes('rwd') || v.includes('rear')) return DrivetrainType.RWD
  if (v.includes('fwd') || v.includes('front')) return DrivetrainType.FWD
  return null
}

function num(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

function int(val: unknown): number | null {
  const n = num(val)
  return n === null ? null : Math.round(n)
}

// ── Main import ──────────────────────────────────────────────────────────────

async function main() {
  console.log('🚗 CarDataWiki — Data Import')
  console.log('━'.repeat(50))

  // 1. Fetch brand list
  console.log('\n📋 Fetching brand list...')
  let brands: { name?: string; title?: string; brand?: string }[]
  try {
    const raw = await fetchJson(`${BASE_URL}/brands.json`)
    brands = Array.isArray(raw) ? raw : (raw as { brands?: [] }).brands ?? []
  } catch {
    console.log('  Trying alternative path...')
    const raw = await fetchJson(`${BASE_URL}/data/brands.json`)
    brands = Array.isArray(raw) ? raw : []
  }
  console.log(`  Found ${brands.length} brands`)

  let makeCount = 0, modelCount = 0, variantCount = 0, errorCount = 0

  for (const brandEntry of brands) {
    const brandName: string = (brandEntry.name ?? brandEntry.title ?? brandEntry.brand ?? '').toString().trim()
    if (!brandName) continue

    const makeSlugVal = slugify(brandName)

    // 2. Upsert Make
    const make = await prisma.make.upsert({
      where: { slug: makeSlugVal },
      update: {},
      create: { name: brandName, slug: makeSlugVal },
    })
    makeCount++
    process.stdout.write(`\r  Processing makes: ${makeCount}/${brands.length} — ${brandName}                    `)

    // 3. Fetch models for this brand
    let models: Record<string, unknown>[]
    try {
      const raw = await fetchJson(`${BASE_URL}/models/${encodeURIComponent(brandName)}.json`)
      models = Array.isArray(raw) ? raw : (raw as { models?: [] }).models ?? []
    } catch {
      try {
        const raw = await fetchJson(`${BASE_URL}/models/${makeSlugVal}.json`)
        models = Array.isArray(raw) ? raw : []
      } catch {
        errorCount++
        continue
      }
    }

    for (const modelEntry of models) {
      const modelName: string = (
        (modelEntry.name ?? modelEntry.title ?? modelEntry.model) as string ?? ''
      ).toString().trim()
      if (!modelName) continue

      const modelSlugVal = modelSlug(brandName, modelName)

      const model = await prisma.model.upsert({
        where: { slug: modelSlugVal },
        update: {},
        create: {
          makeId: make.id,
          name: modelName,
          slug: modelSlugVal,
          bodyStyle: (modelEntry.body_style ?? modelEntry.bodyStyle ?? null) as string | null,
        },
      })
      modelCount++

      // 4. Variants / specs
      const specEntries: Record<string, unknown>[] =
        Array.isArray(modelEntry.variants) ? modelEntry.variants as Record<string, unknown>[] :
        Array.isArray(modelEntry.specs)    ? modelEntry.specs as Record<string, unknown>[]    :
        Array.isArray(modelEntry.options)  ? modelEntry.options as Record<string, unknown>[]  : []

      for (const spec of specEntries) {
        const variantName: string = (
          (spec.name ?? spec.title ?? spec.trim ?? spec.variant) as string ?? 'Base'
        ).toString().trim()

        const variantSlugVal = variantSlug(brandName, modelName, variantName)

        try {
          await prisma.modelVariant.upsert({
            where: { slug: variantSlugVal },
            update: {},
            create: {
              modelId: model.id,
              name: variantName,
              slug: variantSlugVal,
              yearFrom: int(spec.year_from ?? spec.yearFrom ?? spec.year ?? null),
              yearTo:   int(spec.year_to   ?? spec.yearTo   ?? null),

              engineCode:         (spec.engine_code ?? spec.engineCode ?? null) as string | null,
              engineDisplacement: int(spec.displacement ?? spec.engine_displacement ?? spec.engineDisplacement),
              engineCylinders:    int(spec.cylinders ?? spec.engineCylinders),
              engineValves:       int(spec.valves ?? spec.engineValves),
              engineFuelType:     parseFuelType(spec.fuel_type as string ?? spec.fuelType as string ?? spec.fuel as string),
              enginePowerBhp:     num(spec.power_bhp ?? spec.powerBhp ?? spec.bhp ?? spec.hp),
              enginePowerKw:      num(spec.power_kw  ?? spec.powerKw  ?? spec.kw),
              engineTorqueNm:     num(spec.torque_nm ?? spec.torqueNm ?? spec.torque),
              engineAspiration:   (spec.aspiration ?? null) as string | null,
              enginePosition:     (spec.engine_position ?? spec.enginePosition ?? null) as string | null,

              gearboxType: parseGearbox(spec.gearbox as string ?? spec.transmission as string),
              gears:       int(spec.gears ?? spec.number_of_gears ?? spec.numberOfGears),
              drivetrain:  parseDrivetrain(spec.drivetrain as string ?? spec.drive as string),

              acceleration0100: num(spec.acceleration_0_100 ?? spec.acceleration0100 ?? spec.zero_to_100),
              topSpeedKph:      int(spec.top_speed_kph ?? spec.topSpeedKph ?? spec.max_speed),
              topSpeedMph:      int(spec.top_speed_mph ?? spec.topSpeedMph),

              fuelEconomyCombinedMpg:    num(spec.fuel_economy_combined_mpg ?? spec.combined_mpg ?? spec.mpg),
              fuelEconomyCombinedL100:   num(spec.fuel_economy_combined_l100 ?? spec.combined_l100),
              fuelEconomyUrbanL100:      num(spec.fuel_economy_urban_l100    ?? spec.urban_l100),
              fuelEconomyExtraUrbanL100: num(spec.fuel_economy_extra_urban_l100 ?? spec.extra_urban_l100),
              fuelTankLitres:            int(spec.fuel_tank_litres ?? spec.tank_capacity ?? spec.fuelTank),

              co2Gkm:            int(spec.co2_gkm ?? spec.co2  ?? spec.emissions_co2),
              emissionsStandard: (spec.emissions_standard ?? spec.euro_standard ?? null) as string | null,
              noxMgkm:           num(spec.nox_mgkm ?? spec.nox),

              lengthMm:      int(spec.length_mm  ?? spec.length),
              widthMm:       int(spec.width_mm   ?? spec.width),
              heightMm:      int(spec.height_mm  ?? spec.height),
              wheelbaseMm:   int(spec.wheelbase_mm ?? spec.wheelbase),
              weightKg:      int(spec.kerb_weight_kg ?? spec.weight_kg ?? spec.weight ?? spec.kerb_weight),
              grossWeightKg: int(spec.gross_weight_kg ?? spec.gross_weight ?? spec.gvw),
              bootLitres:    int(spec.boot_litres ?? spec.boot_capacity ?? spec.trunk_litres),
              bootLitresMax: int(spec.boot_litres_max ?? spec.boot_capacity_max),

              tyreFront: (spec.tyre_front ?? spec.tire_front ?? null) as string | null,
              tyreRear:  (spec.tyre_rear  ?? spec.tire_rear  ?? null) as string | null,
              brakeFront: (spec.brake_front ?? spec.brakes_front ?? null) as string | null,
              brakeRear:  (spec.brake_rear  ?? spec.brakes_rear  ?? null) as string | null,

              doors: int(spec.doors ?? spec.number_of_doors),
              seats: int(spec.seats ?? spec.number_of_seats),
              bodyType: (spec.body_type ?? spec.bodyStyle ?? spec.body ?? null) as string | null,

              batteryKwh:      num(spec.battery_kwh ?? spec.battery_capacity),
              electricRangeKm: int(spec.electric_range_km ?? spec.electric_range),
              chargingKw:      num(spec.charging_kw ?? spec.max_charging),
            },
          })
          variantCount++
        } catch (e) {
          errorCount++
          if (process.env.DEBUG) console.error(`\n  Error for ${variantSlugVal}:`, e)
        }
      }
    }
  }

  console.log('\n\n' + '━'.repeat(50))
  console.log(`✅ Import complete:`)
  console.log(`   Makes:    ${makeCount}`)
  console.log(`   Models:   ${modelCount}`)
  console.log(`   Variants: ${variantCount}`)
  console.log(`   Errors:   ${errorCount}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
