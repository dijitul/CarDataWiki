import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  async function getSubscriptionByCustomer(customerId: string) {
    return prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } })
  }

  function mapStatus(status: Stripe.Subscription.Status): string {
    const map: Record<string, string> = {
      active: 'ACTIVE', trialing: 'TRIALING', past_due: 'PAST_DUE',
      canceled: 'CANCELLED', incomplete: 'INACTIVE', incomplete_expired: 'INACTIVE',
      unpaid: 'PAST_DUE', paused: 'INACTIVE',
    }
    return map[status] ?? 'INACTIVE'
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const existing = await getSubscriptionByCustomer(sub.customer as string)
      if (existing) {
        await prisma.subscription.update({
          where: { stripeCustomerId: sub.customer as string },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId:        sub.items.data[0]?.price.id,
            status:               mapStatus(sub.status) as never,
            currentPeriodEnd:     new Date(sub.current_period_end * 1000),
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data:  { status: 'CANCELLED', stripeSubscriptionId: null },
      })
      break
    }

    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice
      if (inv.customer) {
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: inv.customer as string },
          data:  { status: 'PAST_DUE' },
        })
      }
      break
    }

    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice
      if (inv.customer) {
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: inv.customer as string },
          data:  { status: 'ACTIVE' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
