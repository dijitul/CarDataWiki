import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { variantsToCsv } from '@/lib/csv/exporter'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { makeSlug: string } }) {
  const make = await prisma.make.findUnique({ where: { slug: params.makeSlug } })
  if (!make) return NextResponse.json({ error: 'Make not found' }, { status: 404 })

  const variants = await prisma.modelVariant.findMany({
    where: { model: { makeId: make.id } },
    include: { model: { include: { make: true } } },
    orderBy: [{ model: { name: 'asc' } }, { name: 'asc' }],
  })

  const csv = variantsToCsv(variants)
  const filename = `${params.makeSlug}-specifications.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
