export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  balanceAfter: number
  description: string
  paymentId: string | null
  createdAt: Date
}

export type TransactionType = 'PURCHASE' | 'DEBIT' | 'REFUND' | 'BONUS' | 'SIGNUP_BONUS'

export interface Payment {
  id: string
  userId: string
  gateway: 'razorpay' | 'stripe'
  gatewayOrderId: string | null
  gatewayPaymentId: string | null
  amountInr: number
  currency: string
  creditsPurchased: number
  status: PaymentStatus
  createdAt: Date
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export interface Resume {
  id: string
  userId: string
  fileName: string
  fileUrl: string
  fileType: 'pdf' | 'docx'
  fileSizeKb: number
  extractedText: string | null
  uploadedAt: Date
}

export interface Analysis {
  id: string
  userId: string
  resumeId: string
  overallScore: number
  atsScore: number
  sectionScores: SectionScores
  suggestions: string[]
  keywordsFound: string[]
  keywordsMissing: string[]
  aiModel: string
  tokensUsed: number
  analyzedAt: Date
  resume?: Pick<Resume, 'fileName' | 'fileType'>
}

export interface SectionScores {
  contact_info: number
  summary: number
  experience: number
  education: number
  skills: number
  formatting: number
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  priceInr: number
  priceUsd: number
  popular?: boolean
  description: string
}

export interface PromoCode {
  id: string
  code: string
  bonusCredits: number
  maxUses: number
  currentUses: number
  expiresAt: Date | null
  isActive: boolean
}

// API Response types
export interface ApiResponse<T = unknown> {
  success?: boolean
  error?: string
  data?: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
