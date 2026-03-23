import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const t0 = Date.now()
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if (!auth) return NextResponse.json({ error: 'Invalid API key', code: 'UNAUTHORIZED' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page     = Math.max(1, Number(searchParams.get('page')    ?? 1))
  const limit    = Math.min(200, Math.max(1, Number(searchParams.get('limit') ?? 50)))
  const skip     = (page - 1) * limit
  const makeSlug = searchParams.get('make')  ?? undefined
  const modelSlug= searchParams.get('model') ?? undefined
  const fuel     = searchParams.get('fuel')  ?? undefined
  const yearFrom = searchParams.get('yearFrom') ? Number(searchParams.get('yearFrom')) : undefined
  const yearTo   = searchParams.get('yearTo')   ? Number(searchParams.get('yearTo'))   : undefined

  const where = {
    ...(modelSlug ? { model: { slug: modelSlug } } : makeSlug ? { model: { make: { slug: makeSlug } } } : {}),
    ...(fuel ? { engineFuelType: fuel as never } : {}),
    ...(yearFrom ? { yearFrom: { gte: yearFrom } } : {}),
    ...(yearTo   ? { yearTo:   { lte: yearTo   } } : {}),
  }

  const [variants, total] = await Promise.all([
    prisma.modelVariant.findMany({
      where, skip, take: limit,
      orderBy: { name: 'asc' },
      include: { model: { include: { make: true } } },
    }),
    prisma.modelVariant.count({ where }),
  ])

  prisma.apiUsage.create({ data: { apiKeyId: auth.apiKeyId, endpoint: '/api/v1/variants', statusCode: 200, durationMs: Date.now() - t0 } }).catch(() => {})

  return NextResponse.json({
    data: variants.map(v => ({
      id: v.id, slug: v.slug, name: v.name,
      make: v.model.make.name, model: v.model.name,
      yearFrom: v.yearFrom, yearTo: v.yearTo,
      engineFuelType: v.engineFuelType, enginePowerBhp: v.enginePowerBhp,
      engineTorqueNm: v.engineTorqueNm, acceleration0100: v.acceleration0100,
      topSpeedKph: v.topSpeedKph, co2Gkm: v.co2Gkm,
    })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}
