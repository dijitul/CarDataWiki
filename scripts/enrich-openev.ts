/**
 * CarDataWiki — OpenEV Data Enrichment
 *
 * Fills EV-specific gaps (battery kWh, charging kW, WLTP range, torque, 0-100,
 * top speed) on existing ELECTRIC variants by fuzzy-matching OpenEV Data rows.
 * Source: https://github.com/open-ev-data/open-ev-data-dataset (CDLA-Permissive-2.0)
 *
 * Matching: make slug + model name tokens; then picks the OpenEV row whose
 * power (kW) and battery are closest to the variant's known values. Fill-blanks
 * only — never overwrites wiki-edited data.
 *
 * Run: npx tsx scripts/enrich-openev.ts [path/to/open-ev-data.csv]
 *      (default: ./oev.csv)
 */

import { readFileSync } from 'fs'
import Papa from 'papaparse'
import { PrismaClient, Prisma } from '@prisma/client'
import { slugify } from '../src/lib/slugify'

const prisma = new PrismaClient()

interface OevRow {
  make_name: string; model_name: string; year: string; trim_name: string; variant_name: string
  drivetrain: string; system_power_kw: string; system_torque_nm: string
  battery_capacity_gross_kwh: string; battery_capacity_net_kwh: string
  dc_max_power_kw: string; range_wltp_km: string
  acceleration_0_100_s: string; top_speed_kmh: string
}

const num = (v: string | undefined): number | null => {
  const n = Number(v)
  return v !== undefined && v !== '' && Number.isFinite(n) ? n : null
}

const norm = (s: string) => slugify(s).replace(/-/g, '')

async function main() {
  const csvPath = process.argv[2] ?? 'oev.csv'
  const { data } = Papa.parse<OevRow>(readFileSync(csvPath, 'utf8'), { header: true, skipEmptyLines: true })
  console.log(`📄 OpenEV rows: ${data.length}`)

  // index by normalized make
  const byMake = new Map<string, OevRow[]>()
  for (const r of data) {
    const k = norm(r.make_name)
    if (!byMake.has(k)) byMake.set(k, [])
    byMake.get(k)!.push(r)
  }

  const evVariants = await prisma.modelVariant.findMany({
    where: { engineFuelType: 'ELECTRIC' },
    include: { model: { include: { make: true } } },
  })
  console.log(`🔎 Electric variants in DB: ${evVariants.length}`)

  let enriched = 0, matchedNoGaps = 0, unmatched = 0
  for (const v of evVariants) {
    const rows = byMake.get(norm(v.model.make.name)) ?? []
    // model-name token containment either way
    const vm = norm(v.model.name)
    let candidates = rows.filter(r => {
      const om = norm(r.model_name)
      return om.includes(vm) || vm.includes(om)
    })
    if (!candidates.length) { unmatched++; continue }

    // score: closeness of power kW, battery kWh, and year overlap
    const p = v.enginePowerKw ? Number(v.enginePowerKw) : null
    const b = v.batteryKwh ? Number(v.batteryKwh) : null
    const score = (r: OevRow) => {
      let s = 0
      const rp = num(r.system_power_kw), rbG = num(r.battery_capacity_gross_kwh), rbN = num(r.battery_capacity_net_kwh)
      if (p !== null && rp !== null) s -= Math.abs(p - rp)
      if (b !== null && (rbG !== null || rbN !== null))
        s -= Math.min(Math.abs(b - (rbG ?? 99)), Math.abs(b - (rbN ?? 99)))
      const ry = num(r.year)
      if (v.yearFrom && ry) s -= Math.abs(v.yearFrom - ry) * 0.5
      return s
    }
    candidates.sort((a, z) => score(z) - score(a))
    const best = candidates[0]

    // sanity: if we know power, reject matches >15% off
    const bp = num(best.system_power_kw)
    if (p !== null && bp !== null && Math.abs(p - bp) / Math.max(p, bp) > 0.15) { unmatched++; continue }

    const fill: Record<string, unknown> = {}
    if (v.batteryKwh === null) {
      const kwh = num(best.battery_capacity_net_kwh) ?? num(best.battery_capacity_gross_kwh)
      if (kwh !== null) fill.batteryKwh = new Prisma.Decimal(kwh)
    }
    if (v.chargingKw === null && num(best.dc_max_power_kw) !== null)
      fill.chargingKw = new Prisma.Decimal(num(best.dc_max_power_kw)!)
    if (v.electricRangeKm === null && num(best.range_wltp_km) !== null)
      fill.electricRangeKm = Math.round(num(best.range_wltp_km)!)
    if (v.engineTorqueNm === null && num(best.system_torque_nm) !== null)
      fill.engineTorqueNm = new Prisma.Decimal(num(best.system_torque_nm)!)
    if (v.acceleration0100 === null && num(best.acceleration_0_100_s) !== null)
      fill.acceleration0100 = new Prisma.Decimal(num(best.acceleration_0_100_s)!)
    if (v.topSpeedKph === null && num(best.top_speed_kmh) !== null) {
      fill.topSpeedKph = Math.round(num(best.top_speed_kmh)!)
      fill.topSpeedMph = Math.round(num(best.top_speed_kmh)! * 0.621371)
    }
    if (v.enginePowerKw === null && bp !== null) fill.enginePowerKw = new Prisma.Decimal(bp)

    if (Object.keys(fill).length) {
      await prisma.modelVariant.update({ where: { id: v.id }, data: fill })
      enriched++
    } else matchedNoGaps++
  }

  console.log(`\n✅ OpenEV enrichment done. Enriched: ${enriched}, matched-no-gaps: ${matchedNoGaps}, unmatched: ${unmatched}`)
  console.log('   Attribution: OpenEV Data (CDLA-Permissive-2.0), https://open-ev-data.github.io/')
}

main().finally(() => prisma.$disconnect())
