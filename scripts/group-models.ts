/**
 * Assigns groupSlug / groupName to every Model row.
 *
 * Strategy: the first whitespace-separated token of the model name becomes
 * the group identifier (e.g. "A3 Cabriolet" → group "A3", "1 Series" → group "1").
 * This cleanly clusters all Audi A3 body styles under one A3 group, all
 * A4 body styles under A4, etc.
 *
 * Run:  set -a && source .env && set +a && npm run group:models
 */

import { prisma } from '../src/lib/prisma'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractGroup(modelName: string): { groupName: string; groupSlug: string } {
  const firstWord = modelName.trim().split(/\s+/)[0]
  return {
    groupName:  firstWord,
    groupSlug:  toSlug(firstWord),
  }
}

async function main() {
  const models = await prisma.model.findMany({ select: { id: true, name: true } })
  console.log(`Assigning groups to ${models.length} models…`)

  let updated = 0
  for (const model of models) {
    const { groupName, groupSlug } = extractGroup(model.name)
    await prisma.model.update({
      where: { id: model.id },
      data:  { groupName, groupSlug },
    })
    updated++
    if (updated % 500 === 0) console.log(`  ${updated} / ${models.length}`)
  }

  console.log(`Done — ${updated} models updated.`)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
