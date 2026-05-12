export type CreditPack = {
  id: string
  name: string
  credits: number
  priceInr: number // In paise
  popular?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter_pack', name: 'Starter', credits: 5, priceInr: 9900 },
  { id: 'pro_pack', name: 'Pro', credits: 25, priceInr: 39900, popular: true },
  { id: 'enterprise_pack', name: 'Enterprise', credits: 100, priceInr: 129900 },
]
