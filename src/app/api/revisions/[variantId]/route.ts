import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { variantId: string } }) {
  const fieldName = req.nextUrl.searchParams.get('fieldName')

  const revisions = await prisma.revision.findMany({
    where: {
      variantId: params.variantId,
      ...(fieldName ? { fieldName } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  })

  return NextResponse.json({ revisions })
}
