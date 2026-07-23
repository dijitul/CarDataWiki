/**
 * CarDataWiki — Research JSON Importer
 *
 * Imports agent-gathered brand/model/variant data from data-research/*.json
 * files matching the shape:
 *   [{ make, country?, models: [{ name, bodyType?, variants: [{...spec fields}] }] }]
 *
 * Run: npx tsx scripts/import-research.ts <file.json> [file2.json ...]
 *      npx tsx scripts/import-research.ts --all   (all known research files)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { PrismaClient, FuelType, GearboxType, DrivetrainType, Prisma } from '@prisma/client'
import { makeSlug, modelSlug, variantSlug } from '../src/lib/slugify'

const prisma = new PrismaClient()
const RESEARCH_DIR = join(process.cwd(), 'data-research')

const DEFAULT_FILES = [
  '04-new-ev-brands-specs.json',
  'g-rover-historic.json',
  'h-missing-brands.json',
  'i-brand-updates.json',
]

// ─── field mapping helpers ────────────────────────────────────────────────────

const FUEL: Record<string, FuelType> = {
  PETROL: 'PETROL', DIESEL: 'DIESEL', ELECTRIC: 'ELECTRIC',
  HYBRID_PETROL: 'HYBRID_PETROL', HYBRID_DIESEL: 'HYBRID_DIESEL',
  PLUG_IN_HYBRID: 'PLUG_IN_HYBRID', HYDROGEN: 'HYDROGEN', LPG: 'LPG',
  // aliases agents may have used
  HYBRID: 'HYBRID_PETROL', PHEV: 'PLUG_IN_HYBRID', REEV: 'PLUG_IN_HYBRID',
  BEV: 'ELECTRIC', EV: 'ELECTRIC', MHEV: 'PETROL',
}
const GEARBOX: Record<string, GearboxType> = {
  MANUAL: 'MANUAL', AUTOMATIC: 'AUTOMATIC', CVT: 'CVT', DCT: 'DCT',
  SEMI_AUTOMATIC: 'SEMI_AUTOMATIC', AUTO: 'AUTOMATIC',
  SINGLE_SPEED: 'AUTOMATIC', REDUCTION_GEAR: 'AUTOMATIC', AMT: 'SEMI_AUTOMATIC',
}
const DRIVE: Record<string, DrivetrainType> = {
  FWD: 'FWD', RWD: 'RWD', AWD: 'AWD', FOUR_WD: 'FOUR_WD',
  '4WD': 'FOUR_WD', '4X4': 'FOUR_WD',
}

const num = (v: unknown): number | null =>
  v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v)
const int = (v: unknown): number | null => {
  const n = num(v)
  return n === null ? null : Math.round(n)
}
const dec = (v: unknown): Prisma.Decimal | null => {
  const n = num(v)
  return n === null ? null : new Prisma.Decimal(n)
}
const enumVal = <T>(map: Record<string, T>, v: unknown): T | null => {
  if (typeof v !== 'string' || !v) return null
  return map[v.toUpperCase().replace(/[\s-]/g, '_')] ?? null
}

// ─── import ───────────────────────────────────────────────────────────────────

interface Counts { makes: number; models: number; created: number; updated: number; skipped: number }

async function importFile(path: string, counts: Counts) {
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const makes = Array.isArray(data) ? data : data.makes ?? [data]

  for (const mk of makes) {
    if (!mk?.make || !Array.isArray(mk.models) || mk.models.length === 0) continue

    const make = await prisma.make.upsert({
      where: { slug: makeSlug(mk.make) },
      update: { country: mk.country ?? undefined },
      create: { name: mk.make, slug: makeSlug(mk.make), country: mk.country ?? null },
    })
    counts.makes++

    for (const mo of mk.models) {
      if (!mo?.name) continue
      let mSlug = modelSlug(mk.make, mo.name)
      const slugClash = await prisma.model.findUnique({ where: { slug: mSlug } })
      if (slugClash && slugClash.makeId !== make.id) mSlug = `${mSlug}-2`
      const existingByName = await prisma.model.findUnique({
        where: { makeId_name: { makeId: make.id, name: mo.name } },
      })
      const model = existingByName
        ? await prisma.model.update({
            where: { id: existingByName.id },
            data: { bodyStyle: mo.bodyType ?? undefined },
          })
        : slugClash && slugClash.makeId === make.id
          ? slugClash // same make, same slug, different name casing — reuse
          : await prisma.model.create({
              data: { makeId: make.id, name: mo.name, slug: mSlug, bodyStyle: mo.bodyType ?? null },
            })
      counts.models++

      for (const v of mo.variants ?? []) {
        if (!v?.name) { counts.skipped++; continue }
        // year suffix keeps e.g. pre/post-facelift variants with identical names unique
        let vSlug = variantSlug(mk.make, mo.name, v.name)
        const clash = await prisma.modelVariant.findUnique({ where: { slug: vSlug } })
        if (clash && clash.modelId !== model.id) vSlug = `${vSlug}-${v.yearFrom ?? 'x'}`

        const fields = {
          yearFrom: int(v.yearFrom),
          yearTo: int(v.yearTo),
          engineCode: v.engineCode ?? null,
          engineDisplacement: int(v.engineDisplacement),
          engineCylinders: int(v.cylinders ?? v.engineCylinders),
          engineFuelType: enumVal(FUEL, v.fuelType),
          enginePowerKw: dec(v.powerKw),
          enginePowerBhp: dec(v.powerBhp),
          engineTorqueNm: dec(v.torqueNm),
          gearboxType: enumVal(GEARBOX, v.gearboxType),
          gears: int(v.gears),
          drivetrain: enumVal(DRIVE, v.drivetrain),
          acceleration0100: dec(v.acceleration0100),
          topSpeedKph: int(v.topSpeedKph),
          topSpeedMph: v.topSpeedKph ? Math.round(Number(v.topSpeedKph) * 0.621371) : null,
          fuelEconomyCombinedMpg: dec(v.combinedMpg),
          co2Gkm: int(v.co2Gkm),
          lengthMm: int(v.lengthMm),
          widthMm: int(v.widthMm),
          heightMm: int(v.heightMm),
          wheelbaseMm: int(v.wheelbaseMm),
          weightKg: int(v.weightKg),
          bootLitres: int(v.bootLitres),
          doors: int(v.doors),
          seats: int(v.seats),
          bodyType: v.bodyType ?? mo.bodyType ?? null,
          batteryKwh: dec(v.batteryKwh),
          electricRangeKm: int(v.electricRangeKm),
          chargingKw: dec(v.chargingKw),
        }

        const existing = await prisma.modelVariant.findUnique({ where: { slug: vSlug } })
        if (existing) {
          // fill blanks only — never clobber wiki-edited values with nulls
          const patch: Record<string, unknown> = {}
          for (const [k, val] of Object.entries(fields)) {
            if (val !== null && (existing as Record<string, unknown>)[k] === null) patch[k] = val
          }
          if (Object.keys(patch).length) {
            await prisma.modelVariant.update({ where: { slug: vSlug }, data: patch })
            counts.updated++
          } else counts.skipped++
        } else {
          await prisma.modelVariant.create({
            data: { modelId: model.id, name: v.name, slug: vSlug, ...fields },
          })
          counts.created++
        }
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const files = args.includes('--all')
    ? DEFAULT_FILES.map(f => join(RESEARCH_DIR, f)).filter(existsSync)
    : args.map(f => (existsSync(f) ? f : join(RESEARCH_DIR, f)))

  if (!files.length) {
    console.error('No input files. Usage: tsx scripts/import-research.ts <file.json>|--all')
    process.exit(1)
  }

  const counts: Counts = { makes: 0, models: 0, created: 0, updated: 0, skipped: 0 }
  for (const f of files) {
    console.log(`📥 Importing ${f}`)
    await importFile(f, counts)
  }
  console.log(`\n✅ Done. Makes touched: ${counts.makes}, models: ${counts.models}, ` +
    `variants created: ${counts.created}, enriched: ${counts.updated}, unchanged/skipped: ${counts.skipped}`)
}

main().finally(() => prisma.$disconnect())
