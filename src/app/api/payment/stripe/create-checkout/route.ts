import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { CREDIT_PACKS } from '@/lib/pricing'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packId } = await req.json()
    const pack = CREDIT_PACKS.find((p) => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?session_id={CHECKOUT_SESSION_ID}&pack_id=${packId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?canceled=true`,
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${pack.credits} Credits — ${pack.name} Pack`,
              description: 'ResumeAI Credits',
            },
            unit_amount: pack.priceInr,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        packId: pack.id,
        credits: pack.credits.toString(),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Stripe create checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
