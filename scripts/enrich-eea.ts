/**
 * CarDataWiki — EEA co2cars Enrichment
 *
 * Fills kerb mass (m kg), wheelbase (W mm) and missing CO2/power/displacement
 * on existing variants using the EEA "CO2 emissions from new passenger cars"
 * dataset via the Discodata SQL endpoint. Free re-use with attribution (EEA).
 *
 * Matching per make: EU-registered variant rows grouped by (model, fuel, cc, kW);
 * a DB variant matches when fuel+cc agree and power is within tolerance.
 * Fill-blanks only.
 *
 * Run: npx tsx scripts/enrich-eea.ts [MakeName ...]   (default: all makes in DB)
 */

import { PrismaClient, FuelType } from '@prisma/client'

const prisma = new PrismaClient()
const ENDPOINT = 'https://discodata.eea.europa.eu/sql'

interface EeaRow { Cn: string; Ft: string; ec: number | null; ep: number | null; m: number | null; W: number | null; Ewltp: number | null; n: number }

async function queryMake(make: string): Promise<EeaRow[]> {
  const sql = `
    SELECT [Cn] AS Cn, [Ft] AS Ft, [ec (cm3)] AS ec, [ep (KW)] AS ep,
           AVG([m (kg)]) AS m, AVG([W (mm)]) AS W, AVG([Ewltp (g/km)]) AS Ewltp, COUNT(*) AS n
    FROM [CO2Emission].[latest].[co2cars]
    WHERE UPPER([Mk]) = '${make.toUpperCase().replace(/'/g, "''")}' AND [year] >= 2017
    GROUP BY [Cn], [Ft], [ec (cm3)], [ep (KW)]`
  const url = `${ENDPOINT}?query=${encodeURIComponent(sql)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`EEA query failed for ${make}: HTTP ${res.status}`)
  const body = await res.json() as { results?: EeaRow[] }
  return (body.results ?? []).map(r => ({ ...r, m: r.m ? Math.round(r.m) : null, W: r.W ? Math.round(r.W) : null }))
}

const FUEL_MAP: Record<string, FuelType[]> = {
  PETROL: ['PETROL'], DIESEL: ['DIESEL'], ELECTRIC: ['ELECTRIC'],
  'PETROL/ELECTRIC': ['HYBRID_PETROL', 'PLUG_IN_HYBRID'],
  'DIESEL/ELECTRIC': ['HYBRID_DIESEL'], HYDROGEN: ['HYDROGEN'], LPG: ['LPG'],
}
const normName = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')

async function main() {
  const makeFilter = process.argv.slice(2)
  const makes = await prisma.make.findMany({
    where: makeFilter.length ? { name: { in: makeFilter } } : {},
    include: { models: { include: { variants: true } } },
  })

  let enriched = 0, unmatched = 0, queried = 0
  for (const make of makes) {
    const variants = make.models.flatMap(m => m.variants.map(v => ({ v, model: m })))
    // only query EEA when something actually needs mass/wheelbase
    const needy = variants.filter(({ v }) => v.weightKg === null || v.wheelbaseMm === null)
    if (!needy.length) continue

    let rows: EeaRow[]
    try { rows = await queryMake(make.name); queried++ } catch (e) {
      console.warn(`⚠️  ${make.name}: ${(e as Error).message}`); continue
    }
    if (!rows.length) continue
    await new Promise(r => setTimeout(r, 500)) // be polite to the endpoint

    for (const { v, model } of needy) {
      const vFuel = v.engineFuelType
      const candidates = rows.filter(r => {
        if (!r.Cn) return false
        const nameOk = normName(r.Cn).includes(normName(model.name)) || normName(model.name).includes(normName(r.Cn))
        if (!nameOk) return false
        if (vFuel && r.Ft && !(FUEL_MAP[r.Ft.toUpperCase()] ?? []).includes(vFuel)) return false
        if (v.engineDisplacement && r.ec && Math.abs(v.engineDisplacement - r.ec) > 60) return false
        const p = v.enginePowerKw ? Number(v.enginePowerKw) : null
        if (p && r.ep && Math.abs(p - r.ep) / Math.max(p, r.ep) > 0.12) return false
        return true
      })
      if (!candidates.length) { unmatched++; continue }
      // most-registered candidate wins
      candidates.sort((a, z) => z.n - a.n)
      const best = candidates[0]

      const fill: Record<string, unknown> = {}
      if (v.weightKg === null && best.m) fill.weightKg = best.m
      if (v.wheelbaseMm === null && best.W) fill.wheelbaseMm = best.W
      if (v.co2Gkm === null && best.Ewltp) fill.co2Gkm = Math.round(best.Ewltp)
      if (Object.keys(fill).length) {
        await prisma.modelVariant.update({ where: { id: v.id }, data: fill })
        enriched++
      }
    }
  }

  console.log(`\n✅ EEA enrichment done. Makes queried: ${queried}, variants enriched: ${enriched}, unmatched: ${unmatched}`)
  console.log('   Attribution: European Environment Agency, "CO2 emissions from new passenger cars" (free re-use with attribution).')
}

main().finally(() => prisma.$disconnect())
