import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const authSession = await auth()
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    // Verify with Stripe that payment is actually paid
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const userId = session.metadata?.userId
    const packId = session.metadata?.packId
    const credits = parseInt(session.metadata?.credits || '0', 10)

    if (!userId || !credits) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 })
    }

    // Security: ensure the logged-in user matches the one who paid
    if (authSession.user.id !== userId) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 })
    }

    // Check for duplicate: use Payment table (which has gatewayOrderId)
    const existingPayment = await prisma.payment.findFirst({
      where: { gatewayOrderId: sessionId },
    })
    if (existingPayment) {
      // Already processed — return current balance silently
      const wallet = await prisma.wallet.findUnique({ where: { userId } })
      return NextResponse.json({ success: true, message: 'Already processed', newBalance: wallet?.balance ?? 0 })
    }

    // Get current balance so we can calculate balanceAfter
    const wallet = await prisma.wallet.findUnique({ where: { userId } })
    const currentBalance = wallet?.balance ?? 0
    const newBalance = currentBalance + credits
    const paymentIntentId = (session.payment_intent as string) || session.id

    // Atomically: upsert wallet, create Transaction record, create Payment record
    await prisma.$transaction([
      prisma.wallet.upsert({
        where: { userId },
        update: { balance: { increment: credits } },
        create: { userId, balance: credits },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'PURCHASE',
          amount: credits,
          balanceAfter: newBalance,
          description: `Purchased ${credits} Credits — ${packId}`,
          paymentId: paymentIntentId,
        },
      }),
      prisma.payment.create({
        data: {
          userId,
          gateway: 'stripe',
          gatewayOrderId: sessionId,
          gatewayPaymentId: paymentIntentId,
          amountInr: session.amount_total ?? 0,
          currency: 'INR',
          creditsPurchased: credits,
          status: 'SUCCESS',
        },
      }),
    ])

    return NextResponse.json({ success: true, creditsAdded: credits, newBalance })
  } catch (error: any) {
    console.error('[stripe/verify] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
