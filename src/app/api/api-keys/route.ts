import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateRawKey, hashKey, keyPrefix } from '@/lib/api-auth'
import { z } from 'zod'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { id: true, keyPrefix: true, name: true, lastUsedAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ keys })
}

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })
  if (!subscription || subscription.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'An active subscription is required to generate API keys' }, { status: 403 })
  }

  const body = await _req.json().catch(() => ({}))
  const name = z.string().max(60).optional().parse(body?.name)

  const rawKey = generateRawKey()
  const prefix = keyPrefix(rawKey)

  await prisma.apiKey.create({
    data: {
      userId:        session.user.id,
      subscriptionId: subscription.id,
      keyHash:       hashKey(rawKey),
      keyPrefix:     prefix,
      name:          name ?? null,
    },
  })

  // Return raw key ONCE — never stored
  return NextResponse.json({ key: rawKey, prefix }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Key ID required' }, { status: 400 })

  const key = await prisma.apiKey.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!key) return NextResponse.json({ error: 'Key not found' }, { status: 404 })

  await prisma.apiKey.update({
    where: { id },
    data:  { isActive: false, revokedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
