import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy initialization — prevents build-time crash when keys are not set
function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not configured')
  }
  return new Razorpay({ key_id, key_secret })
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  priceInr: number  // in paise
  priceUsd: number  // in cents
  popular?: boolean
  description: string
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 5,
    priceInr: 9900,   // ₹99
    priceUsd: 119,     // $1.19
    description: 'Perfect to get started',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 25,
    priceInr: 39900,   // ₹399
    priceUsd: 479,     // $4.79
    popular: true,
    description: 'Most popular — best value',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 100,
    priceInr: 129900,  // ₹1,299
    priceUsd: 1559,    // $15.59
    description: 'For teams & career coaches',
  },
]

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex')
  return expectedSignature === signature
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')
  return expectedSignature === signature
}

export async function createRazorpayOrder(
  packId: string,
  userId: string
): Promise<{ orderId: string; amount: number; currency: string }> {
  const pack = CREDIT_PACKS.find((p) => p.id === packId)
  if (!pack) throw new Error('Invalid credit pack')

  const order = await getRazorpayClient().orders.create({
    amount: pack.priceInr,
    currency: 'INR',
    notes: {
      userId,
      packId,
      credits: pack.credits.toString(),
    },
  })

  return {
    orderId: order.id,
    amount: pack.priceInr,
    currency: 'INR',
  }
}
