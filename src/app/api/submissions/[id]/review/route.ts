import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, variantSlug } from '@/lib/slugify'
import { z } from 'zod'
import type { AiAnalysisReport } from '@/lib/csv/ai-analyser'

const Schema = z.object({
  action:    z.enum(['approve', 'discard']),
  adminNote: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { action, adminNote } = parsed.data

  const submission = await prisma.csvSubmission.findUnique({ where: { id: params.id } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.status !== 'AWAITING_REVIEW') {
    return NextResponse.json({ error: 'Submission is not awaiting review' }, { status: 409 })
  }

  if (action === 'discard') {
    await prisma.csvSubmission.update({
      where: { id: params.id },
      data: { status: 'DISCARDED', adminNote: adminNote ?? null, reviewedBy: session.user.id, reviewedAt: new Date() },
    })
    return NextResponse.json({ status: 'DISCARDED' })
  }

  // Approve: import newRows from AI report
  const report = submission.aiReport as unknown as AiAnalysisReport | null
  let imported = 0

  if (report?.newRows?.length) {
    for (const row of report.newRows) {
      const makeName  = String(row.make  ?? '')
      const modelName = String(row.model ?? '')
      const varName   = String(row.name  ?? row.variant ?? 'Base')
      if (!makeName || !modelName) continue

      const makeSlugVal  = slugify(makeName)
      const modelSlugVal = slugify(`${makeName}-${modelName}`)
      const vSlug        = variantSlug(makeName, modelName, varName)

      try {
        const make = await prisma.make.upsert({
          where:  { slug: makeSlugVal },
          update: {},
          create: { name: makeName, slug: makeSlugVal },
        })
        const model = await prisma.model.upsert({
          where:  { slug: modelSlugVal },
          update: {},
          create: { makeId: make.id, name: modelName, slug: modelSlugVal },
        })
        await prisma.modelVariant.upsert({
          where:  { slug: vSlug },
          update: {},
          create: {
            modelId: model.id,
            name:    varName,
            slug:    vSlug,
            yearFrom: row.yearFrom ? Number(row.yearFrom) : null,
            yearTo:   row.yearTo   ? Number(row.yearTo)   : null,
            enginePowerBhp: row.enginePowerBhp ? Number(row.enginePowerBhp) : null,
            co2Gkm:         row.co2Gkm         ? Number(row.co2Gkm)         : null,
          },
        })
        imported++
      } catch { /* skip individual errors */ }
    }
  }

  await prisma.csvSubmission.update({
    where: { id: params.id },
    data: { status: 'APPROVED', adminNote: adminNote ?? null, reviewedBy: session.user.id, reviewedAt: new Date() },
  })

  return NextResponse.json({ status: 'APPROVED', imported })
}
