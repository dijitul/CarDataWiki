import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const t0 = Date.now()
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if (!auth) return NextResponse.json({ error: 'Invalid API key', code: 'UNAUTHORIZED' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page  = Math.max(1, Number(searchParams.get('page')  ?? 1))
  const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit') ?? 50)))
  const skip  = (page - 1) * limit

  const [makes, total] = await Promise.all([
    prisma.make.findMany({
      skip, take: limit,
      orderBy: { name: 'asc' },
      include: { _count: { select: { models: true } } },
    }),
    prisma.make.count(),
  ])

  logUsage(auth.apiKeyId, '/api/v1/makes', 200, Date.now() - t0)

  return NextResponse.json({
    data: makes.map(m => ({ id: m.id, name: m.name, slug: m.slug, country: m.country, modelCount: m._count.models })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

function logUsage(apiKeyId: string, endpoint: string, statusCode: number, durationMs: number) {
  prisma.apiUsage.create({ data: { apiKeyId, endpoint, statusCode, durationMs } }).catch(() => {})
  prisma.apiKey.update({ where: { id: apiKeyId }, data: { lastUsedAt: new Date() } }).catch(() => {})
}
