import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CREDIT_PACKS, createRazorpayOrder } from '@/lib/razorpay'
import { z } from 'zod'

const createOrderSchema = z.object({
  packId: z.enum(['starter', 'pro', 'enterprise']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { packId } = createOrderSchema.parse(body)

    const pack = CREDIT_PACKS.find((p) => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
    }

    // Create Razorpay order
    const { orderId, amount, currency } = await createRazorpayOrder(packId, session.user.id)

    // Save pending payment
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        gateway: 'razorpay',
        gatewayOrderId: orderId,
        amountInr: amount,
        currency,
        creditsPurchased: pack.credits,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      orderId,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      pack: {
        name: pack.name,
        credits: pack.credits,
        priceInr: pack.priceInr,
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    console.error('[CREATE ORDER ERROR]', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
