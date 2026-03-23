import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EDITABLE_FIELDS } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Schema = z.object({
  variantId: z.string().min(1),
  fieldName: z.string().min(1),
  newValue:  z.string(),
  comment:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in to edit' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { variantId, fieldName, newValue, comment } = parsed.data

  if (!EDITABLE_FIELDS.has(fieldName)) {
    return NextResponse.json({ error: `Field "${fieldName}" is not editable` }, { status: 400 })
  }

  const variant = await prisma.modelVariant.findUnique({
    where: { id: variantId },
    include: { model: { include: { make: true } } },
  })
  if (!variant) {
    return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
  }

  const oldValue = variant[fieldName as keyof typeof variant]
  const oldStr = oldValue !== null && oldValue !== undefined ? String(oldValue) : null

  // Validate type for numeric fields
  const numericFields = new Set(['engineDisplacement','engineCylinders','engineValves',
    'enginePowerBhp','enginePowerKw','engineTorqueNm','gears',
    'acceleration0100','topSpeedKph','topSpeedMph',
    'fuelEconomyCombinedMpg','fuelEconomyCombinedL100','fuelEconomyUrbanL100',
    'fuelEconomyExtraUrbanL100','fuelTankLitres','co2Gkm','noxMgkm',
    'lengthMm','widthMm','heightMm','wheelbaseMm','weightKg','grossWeightKg',
    'bootLitres','bootLitresMax','doors','seats',
    'batteryKwh','electricRangeKm','chargingKw'])

  let castValue: unknown = newValue
  if (newValue !== '' && numericFields.has(fieldName)) {
    const n = Number(newValue)
    if (isNaN(n)) {
      return NextResponse.json({ error: `${fieldName} must be a number` }, { status: 400 })
    }
    castValue = n
  }

  const [revision] = await prisma.$transaction([
    prisma.revision.create({
      data: {
        variantId,
        userId: session.user.id,
        fieldName,
        oldValue: oldStr,
        newValue: newValue || null,
        comment: comment || null,
      },
    }),
    prisma.modelVariant.update({
      where: { id: variantId },
      data: { [fieldName]: castValue === '' ? null : castValue },
    }),
  ])

  // Revalidate the variant page on-demand
  const makeSl  = variant.model.make.slug
  const modelSl = variant.model.slug
  const varSl   = variant.slug
  revalidatePath(`/${makeSl}/${modelSl}/${varSl}`)

  return NextResponse.json({ revision }, { status: 201 })
}
