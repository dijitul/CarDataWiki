/**
 * CarDataWiki — SVA Taxonomy Importer
 *
 * Imports the UK-market vehicle identity spine extracted from the owner's
 * svacarparts.co.uk OpenCart database (see data-research/05-sva-extraction.md):
 * 42 makes / 516 models / 2,441 generations / 7,179 engine variants with
 * year ranges and factory chassis codes — but NO spec figures.
 *
 * Conservative strategy to avoid duplicating the existing spec dataset:
 *  - Makes are always upserted.
 *  - Models are created only if missing (matched case-insensitively by name).
 *  - Engine variants are created ONLY under models this import created
 *    (they carry generation year ranges + chassis code in the name; specs
 *    null — to be enriched by VCA/EEA/wiki edits).
 *  - For EXISTING models nothing is touched by default; pass --fill-years to
 *    fill missing variant yearFrom/yearTo when exactly one generation matches.
 *
 * Run: npx tsx scripts/import-sva.ts [--fill-years]
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { makeSlug, modelSlug, variantSlug } from '../src/lib/slugify'

const prisma = new PrismaClient()
const TREE = join(process.cwd(), 'data-research', '05-sva-vehicle-tree.json')

interface Gen { name: string; mk: number | null; phase: number | null; chassisCode: string | null; yearFrom: number | null; yearTo: number | null; notes: string | null }
interface Body { bodyStyle: string; generations: Gen[] }
interface SvaModel { model: string; bodyStyles: Body[] }
interface SvaMake { make: string; models: SvaModel[] }

// engine variants CSV: make,model,generationRaw,variant
function loadVariants(): Map<string, string[]> {
  const csv = readFileSync(join(process.cwd(), 'data-research', '05-sva-engine-variants.csv'), 'utf8')
  const map = new Map<string, string[]>()
  for (const line of csv.split('\n').slice(1)) {
    const m = line.match(/^([^,]+),("[^"]*"|[^,]*),("[^"]*"|[^,]*),(.*)$/)
    if (!m) continue
    const unq = (s: string) => s.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
    const key = `${unq(m[1])}|${unq(m[2])}|${unq(m[3])}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(unq(m[4]))
  }
  return map
}

async function main() {
  const fillYears = process.argv.includes('--fill-years')
  const tree: SvaMake[] = JSON.parse(readFileSync(TREE, 'utf8'))
  const variantsByGen = loadVariants()

  let makesNew = 0, modelsNew = 0, variantsNew = 0, yearsFilled = 0

  for (const mk of tree) {
    const existingMake =
      (await prisma.make.findUnique({ where: { slug: makeSlug(mk.make) } })) ??
      (await prisma.make.findFirst({ where: { name: { equals: mk.make, mode: 'insensitive' } } }))
    const make = existingMake ?? await prisma.make.create({
      data: { name: mk.make, slug: makeSlug(mk.make), country: null },
    })
    if (!existingMake) makesNew++

    for (const mo of mk.models) {
      const existingModel =
        (await prisma.model.findFirst({
          where: { makeId: make.id, name: { equals: mo.model, mode: 'insensitive' } },
          include: { variants: true },
        })) ??
        (await prisma.model.findUnique({
          where: { slug: modelSlug(mk.make, mo.model) },
          include: { variants: true },
        }))

      const allGens = mo.bodyStyles.flatMap(b => b.generations.map(g => ({ ...g, body: b.bodyStyle })))

      if (!existingModel) {
        const bodyStyle = mo.bodyStyles[0]?.bodyStyle ?? null
        const model = await prisma.model.create({
          data: { makeId: make.id, name: mo.model, slug: modelSlug(mk.make, mo.model), bodyStyle },
        })
        modelsNew++

        // create engine variants per generation (dedup by name+gen)
        const seen = new Set<string>()
        for (const g of allGens) {
          const key = `${mk.make}|${mo.model}|${g.name}`
          for (const vName of variantsByGen.get(key) ?? []) {
            const label = g.chassisCode && !vName.includes(g.chassisCode)
              ? `${vName} (${g.chassisCode})` : vName
            const dedup = `${label}|${g.yearFrom}`
            if (seen.has(dedup)) continue
            seen.add(dedup)
            let slug = variantSlug(mk.make, mo.model, label)
            if (g.yearFrom) slug = `${slug}-${g.yearFrom}`
            if (await prisma.modelVariant.findUnique({ where: { slug } })) continue
            await prisma.modelVariant.create({
              data: {
                modelId: model.id, name: label, slug,
                yearFrom: g.yearFrom, yearTo: g.yearTo,
              },
            })
            variantsNew++
          }
        }
      } else if (fillYears) {
        // fill missing years when the model has exactly one SVA generation span
        const years = allGens.filter(g => g.yearFrom)
        if (!years.length) continue
        const minFrom = Math.min(...years.map(g => g.yearFrom!))
        const maxTo = Math.max(...years.map(g => g.yearTo ?? g.yearFrom!))
        const spansOne = new Set(years.map(g => `${g.yearFrom}-${g.yearTo}`)).size === 1
        if (!spansOne) continue
        for (const v of existingModel.variants) {
          if (v.yearFrom === null && v.yearTo === null) {
            await prisma.modelVariant.update({
              where: { id: v.id }, data: { yearFrom: minFrom, yearTo: maxTo },
            })
            yearsFilled++
          }
        }
      }
    }
  }

  console.log(`\n✅ SVA import done. New makes: ${makesNew}, new models: ${modelsNew}, ` +
    `new variants: ${variantsNew}${fillYears ? `, years filled: ${yearsFilled}` : ''}`)
}

main().finally(() => prisma.$disconnect())
