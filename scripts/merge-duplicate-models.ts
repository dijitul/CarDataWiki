/**
 * CarDataWiki — Duplicate Model Merger
 *
 * The SVA taxonomy import and the research/base imports sometimes created
 * parallel models for the same car under one make (e.g. "25" vs "25 Series",
 * "Metro" vs "Metro / 100"). This pass merges them:
 *
 *  - Models in the same make whose NORMALIZED STEM matches (lowercase; strip
 *    " series" suffix, parentheticals, slashes) are merge candidates.
 *  - The model with the MOST variants wins (keeps its display name).
 *  - When several targets share the stem (e.g. "200 (R3)" and "200 (R8)"),
 *    each variant routes to the target whose variants' year range overlaps its
 *    own yearFrom; unroutable variants stay put (no data loss).
 *  - Variant modelId is updated; emptied duplicate models are deleted.
 *  - Revisions reference variants, not models, so they survive the move.
 *
 * Run: npx tsx scripts/merge-duplicate-models.ts [--dry-run]
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DRY = process.argv.includes('--dry-run')

const stem = (name: string) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')      // strip parentheticals: "200 (R8)" → "200"
    .replace(/\s*\/\s*.*$/, ' ')   // strip alt names: "Metro / 100" → "Metro"
    .replace(/\bseries\b/g, ' ')   // "25 Series" → "25"
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

async function main() {
  const makes = await prisma.make.findMany({
    include: { models: { include: { variants: { select: { id: true, yearFrom: true, yearTo: true } } } } },
  })

  let merged = 0, moved = 0, deleted = 0
  for (const make of makes) {
    const byStem = new Map<string, typeof make.models>()
    for (const m of make.models) {
      const k = stem(m.name)
      if (!k) continue
      if (!byStem.has(k)) byStem.set(k, [])
      byStem.get(k)!.push(m)
    }

    for (const [k, group] of byStem) {
      if (group.length < 2) continue
      // winner: most variants; ties → shortest name (usually the canonical one)
      const sorted = [...group].sort((a, b) =>
        b.variants.length - a.variants.length || a.name.length - b.name.length)
      const targets = sorted.filter(m => m.variants.length > 0)
      const donors = sorted.slice(1)

      for (const donor of donors) {
        // never merge a generation-specific model into another generation-specific one
        const donorIsGenSpecific = /\(.*\)/.test(donor.name)
        const primary = sorted[0]
        if (donorIsGenSpecific && /\(.*\)/.test(primary.name) && donor.id !== primary.id) continue

        for (const v of donor.variants) {
          // route by year overlap when multiple generation-specific targets exist
          let dest = primary
          const genTargets = targets.filter(t => t.id !== donor.id && /\(.*\)/.test(t.name))
          if (genTargets.length > 1 && v.yearFrom) {
            const hit = genTargets.find(t => {
              const froms = t.variants.map(x => x.yearFrom).filter(Boolean) as number[]
              const tos = t.variants.map(x => x.yearTo ?? x.yearFrom).filter(Boolean) as number[]
              if (!froms.length) return false
              return v.yearFrom! >= Math.min(...froms) - 1 && v.yearFrom! <= Math.max(...tos) + 1
            })
            if (hit) dest = hit
            else continue // ambiguous — leave variant on donor
          }
          if (dest.id === donor.id) continue
          if (!DRY) await prisma.modelVariant.update({ where: { id: v.id }, data: { modelId: dest.id } })
          moved++
        }

        const remaining = DRY
          ? donor.variants.length // approximation in dry-run
          : await prisma.modelVariant.count({ where: { modelId: donor.id } })
        if (!DRY && remaining === 0) {
          try {
            await prisma.model.delete({ where: { id: donor.id } })
            deleted++
            console.log(`  merged "${make.name} ${donor.name}" → "${make.name} ${sorted[0].name}"`)
          } catch {
            // variants appeared since count (or FK from another table) — keep the model
          }
        }
      }
      merged++
    }
  }

  console.log(`\n${DRY ? '🔍 DRY RUN — ' : '✅ '}Stem groups with duplicates: ${merged}, variants moved: ${moved}, empty models deleted: ${deleted}`)
}

main().finally(() => prisma.$disconnect())
