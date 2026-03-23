import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe, STRIPE_PRICE_ID } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cardata.wiki'

  // Get or create Stripe customer
  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  let customerId: string

  if (subscription?.stripeCustomerId) {
    customerId = subscription.stripeCustomerId
  } else {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name:  session.user.name  ?? undefined,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id

    subscription = await prisma.subscription.upsert({
      where:  { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: session.user.id, stripeCustomerId: customerId },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url:  `${appUrl}/dashboard/billing?cancelled=1`,
    metadata: { userId: session.user.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
