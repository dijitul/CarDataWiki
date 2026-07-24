import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { variantsToCsv } from '@/lib/csv/exporter'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { makeSlug: string; groupSlug: string } },
) {
  const make = await prisma.make.findUnique({ where: { slug: params.makeSlug } })
  if (!make) return NextResponse.json({ error: 'Make not found' }, { status: 404 })

  const variants = await prisma.modelVariant.findMany({
    where: { model: { makeId: make.id, groupSlug: params.groupSlug } },
    include: { model: { include: { make: true } } },
    orderBy: [{ model: { name: 'asc' } }, { yearFrom: 'desc' }, { name: 'asc' }],
  })
  if (!variants.length) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const csv = variantsToCsv(variants)
  const filename = `${params.makeSlug}-${params.groupSlug}-specifications.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
