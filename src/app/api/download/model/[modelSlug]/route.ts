import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { variantsToCsv } from '@/lib/csv/exporter'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { modelSlug: string } }) {
  const model = await prisma.model.findUnique({
    where: { slug: params.modelSlug },
    include: { make: true },
  })
  if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 })

  const variants = await prisma.modelVariant.findMany({
    where: { modelId: model.id },
    include: { model: { include: { make: true } } },
    orderBy: [{ yearFrom: 'desc' }, { name: 'asc' }],
  })

  const csv = variantsToCsv(variants)
  const filename = `${params.modelSlug}-specifications.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
