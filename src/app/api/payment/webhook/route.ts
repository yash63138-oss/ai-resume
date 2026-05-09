import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature, CREDIT_PACKS } from '@/lib/razorpay'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (!payment) return NextResponse.json({ ok: true })

      const orderId = payment.order_id
      const paymentId = payment.id

      // Find the pending payment
      const existingPayment = await prisma.payment.findFirst({
        where: { gatewayOrderId: orderId },
      })

      if (!existingPayment || existingPayment.status === 'SUCCESS') {
        return NextResponse.json({ ok: true }) // Already processed or not found
      }

      const pack = CREDIT_PACKS.find((p) => p.credits === existingPayment.creditsPurchased)
      const credits = existingPayment.creditsPurchased

      // Atomic update
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            gatewayPaymentId: paymentId,
            status: 'SUCCESS',
            gatewayResponse: payment,
          },
        })

        const currentWallet = await tx.wallet.findUnique({ where: { userId: existingPayment.userId } })
        const newBalance = (currentWallet?.balance ?? 0) + credits

        await tx.wallet.update({
          where: { userId: existingPayment.userId },
          data: { balance: { increment: credits } },
        })

        await tx.transaction.create({
          data: {
            userId: existingPayment.userId,
            type: 'PURCHASE',
            amount: credits,
            balanceAfter: newBalance,
            description: `Purchased ${credits} credits (via webhook)`,
            paymentId,
          },
        })
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WEBHOOK ERROR]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
