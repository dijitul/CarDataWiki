import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { makeSlug: string } }) {
  const t0 = Date.now()
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if (!auth) return NextResponse.json({ error: 'Invalid API key', code: 'UNAUTHORIZED' }, { status: 401 })

  const make = await prisma.make.findUnique({
    where: { slug: params.makeSlug },
    include: { _count: { select: { models: true } } },
  })
  if (!make) return NextResponse.json({ error: 'Make not found' }, { status: 404 })

  prisma.apiUsage.create({ data: { apiKeyId: auth.apiKeyId, endpoint: '/api/v1/makes/:slug', statusCode: 200, durationMs: Date.now() - t0 } }).catch(() => {})

  return NextResponse.json({
    data: { id: make.id, name: make.name, slug: make.slug, country: make.country, logoUrl: make.logoUrl, modelCount: make._count.models },
  })
}
