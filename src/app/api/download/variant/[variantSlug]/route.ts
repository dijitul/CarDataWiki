import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { variantsToCsv } from '@/lib/csv/exporter'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { variantSlug: string } },
) {
  const variant = await prisma.modelVariant.findUnique({
    where: { slug: params.variantSlug },
    include: { model: { include: { make: true } } },
  })
  if (!variant) return NextResponse.json({ error: 'Variant not found' }, { status: 404 })

  const csv = variantsToCsv([variant])
  const filename = `${params.variantSlug}-specification.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
