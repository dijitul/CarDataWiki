import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { variantId: string } }) {
  const t0 = Date.now()
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if (!auth) return NextResponse.json({ error: 'Invalid API key', code: 'UNAUTHORIZED' }, { status: 401 })

  const variant = await prisma.modelVariant.findUnique({
    where: { id: params.variantId },
    include: { model: { include: { make: true } } },
  })
  if (!variant) return NextResponse.json({ error: 'Variant not found' }, { status: 404 })

  prisma.apiUsage.create({ data: { apiKeyId: auth.apiKeyId, endpoint: '/api/v1/variants/:id', statusCode: 200, durationMs: Date.now() - t0 } }).catch(() => {})

  const { model, ...rest } = variant
  return NextResponse.json({
    data: {
      ...rest,
      make:  model.make.name,
      model: model.name,
      makeSlug:  model.make.slug,
      modelSlug: model.slug,
    },
  })
}
