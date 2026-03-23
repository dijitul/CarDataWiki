import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cardata.wiki'

  const portalSession = await stripe.billingPortal.sessions.create({
    customer:   subscription.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
