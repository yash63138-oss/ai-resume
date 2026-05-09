import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature, CREDIT_PACKS } from '@/lib/razorpay'
import { z } from 'zod'

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  packId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packId } = verifySchema.parse(body)

    // Verify Razorpay signature (HMAC SHA256)
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed. Invalid signature.' }, { status: 400 })
    }

    const pack = CREDIT_PACKS.find((p) => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
    }

    // Check for duplicate payment (idempotency)
    const existingPayment = await prisma.payment.findUnique({
      where: { gatewayPaymentId: razorpay_payment_id },
    })

    if (existingPayment?.status === 'SUCCESS') {
      return NextResponse.json({ error: 'Payment already processed' }, { status: 409 })
    }

    // Update payment + add credits atomically
    const [, wallet] = await prisma.$transaction(async (tx) => {
      // Update payment record
      const payment = await tx.payment.update({
        where: { gatewayOrderId: razorpay_order_id },
        data: {
          gatewayPaymentId: razorpay_payment_id,
          status: 'SUCCESS',
          gatewayResponse: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature },
        },
      })

      // Get current balance for transaction record
      const currentWallet = await tx.wallet.findUnique({ where: { userId: session.user.id! } })
      const newBalance = (currentWallet?.balance ?? 0) + pack.credits

      // Add credits to wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId: session.user.id! },
        data: { balance: { increment: pack.credits } },
      })

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: session.user.id!,
          type: 'PURCHASE',
          amount: pack.credits,
          balanceAfter: newBalance,
          description: `Purchased ${pack.credits} credits (${pack.name} Pack)`,
          paymentId: razorpay_payment_id,
        },
      })

      return [payment, updatedWallet]
    })

    return NextResponse.json({
      success: true,
      creditsAdded: pack.credits,
      newBalance: wallet.balance,
      message: `${pack.credits} credits added to your account!`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    console.error('[VERIFY PAYMENT ERROR]', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
