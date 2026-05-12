'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Coins, Star, Zap, ArrowRight, Loader2, CreditCard, TrendingUp, TrendingDown, Gift } from 'lucide-react'
import toast from 'react-hot-toast'
import { CREDIT_PACKS, type CreditPack } from '@/lib/pricing'

interface WalletClientProps {
  balance: number
  transactions: Array<{
    id: string
    type: string
    amount: number
    balanceAfter: number
    description: string
    createdAt: Date
  }>
  userName: string
  userEmail: string
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof TrendingUp }> = {
  PURCHASE:     { label: 'Purchased',    color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: TrendingUp },
  DEBIT:        { label: 'Used',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: TrendingDown },
  REFUND:       { label: 'Refunded',     color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   icon: TrendingUp },
  BONUS:        { label: 'Bonus',        color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  icon: Gift },
  SIGNUP_BONUS: { label: 'Welcome Gift', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Gift },
}

export default function WalletClient({ balance, transactions, userName, userEmail }: WalletClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [buyingPack, setBuyingPack] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  // Verify Stripe payment on return
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const canceled = searchParams.get('canceled')

    if (canceled) {
      toast('Payment cancelled — your credits are unchanged.', { icon: '⚠️' })
      // Force a full server re-fetch so stale cached balance is never shown
      router.replace('/dashboard/wallet')
      router.refresh()
      return
    }

    if (sessionId) {
      setVerifying(true)
      fetch('/api/payment/stripe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.creditsAdded) {
              toast.success(`🎉 ${data.creditsAdded} credits added! New balance: ${data.newBalance}`)
            } else {
              toast('Credits already applied to your account.', { icon: '✅' })
            }
          } else {
            toast.error(data.error || 'Failed to verify payment. Contact support.')
          }
        })
        .catch(() => {
          toast.error('Payment verification failed. Try refreshing.')
        })
        .finally(() => {
          setVerifying(false)
          router.replace('/dashboard/wallet')
          router.refresh()
        })
    }
  }, [searchParams, router])


  const handleBuyCredits = async (pack: CreditPack) => {
    setBuyingPack(pack.id)
    try {
      const res = await fetch('/api/payment/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setBuyingPack(null)
    }
  }

  return (
    <div className="space-y-6 animate-in relative">
      {verifying && (
        <div className="absolute inset-0 z-50 bg-surface-DEFAULT/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
          <p className="font-medium text-lg">Verifying your payment...</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Wallet & Credits</h1>
        <p className="text-white/40 text-sm mt-1">Manage your credits and purchase history</p>
      </div>

      {/* Balance Hero Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(79,94,255,0.2) 0%, rgba(139,92,246,0.15) 100%)',
          border: '1px solid rgba(79,94,255,0.3)',
        }}
      >
        <div className="hero-glow w-64 h-64 bg-brand-500 -top-10 -right-10 opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-white/60 font-medium text-sm">Available Credits</span>
          </div>
          <div className="font-display font-bold text-5xl sm:text-6xl gradient-text mb-2">{balance}</div>
          <p className="text-white/40 text-sm">
            {balance === 0
              ? "You're out of credits. Buy a pack below to continue."
              : `You can analyze ${balance} more resume${balance === 1 ? '' : 's'}.`}
          </p>
        </div>
      </div>

      {/* Pricing Packs */}
      <div>
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2 text-base">
          <CreditCard className="w-5 h-5 text-brand-400" />
          Buy Credits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CREDIT_PACKS.map((pack) => {
            const isBuying = buyingPack === pack.id
            const isDisabled = buyingPack !== null || verifying
            return (
              <button
                key={pack.id}
                id={`buy-${pack.id}-btn`}
                onClick={() => !isDisabled && handleBuyCredits(pack)}
                disabled={isDisabled}
                aria-busy={isBuying}
                className={`relative text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 border focus-visible:ring-2 focus-visible:ring-brand-500 outline-none ${
                  pack.popular ? 'border-brand-500/40' : 'border-white/[0.06] hover:border-white/20'
                } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer active:scale-[0.99]'}`}
                style={{
                  background: pack.popular
                    ? 'linear-gradient(135deg, rgba(79,94,255,0.12) 0%, rgba(139,92,246,0.08) 100%)'
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: pack.popular ? '0 0 30px rgba(79,94,255,0.2)' : undefined,
                }}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-brand flex items-center gap-1 text-xs whitespace-nowrap">
                      <Star className="w-3 h-3 fill-current" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-400 text-sm">{pack.credits} Credits</span>
                </div>

                <div className="font-display font-bold text-2xl sm:text-3xl gradient-text mb-0.5">
                  ₹{(pack.priceInr / 100).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-white/30 mb-4">
                  ₹{(pack.priceInr / 100 / pack.credits).toFixed(2)}/analysis
                </div>

                <div
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                    pack.popular
                      ? 'bg-gradient-brand shadow-brand'
                      : 'bg-white/[0.06] hover:bg-white/[0.1]'
                  }`}
                >
                  {isBuying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Buy {pack.name} <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-white/25 mt-3 text-center">
          Secure payment via Stripe &bull; Credits never expire &bull; Instant delivery
        </p>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2 text-base">
          <Zap className="w-5 h-5 text-purple-400" />
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Coins className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.PURCHASE
              const Icon = cfg.icon
              const isCredit = tx.amount > 0
              return (
                <div
                  key={tx.id}
                  className="glass-card px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tx.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs text-white/25">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Amount + Balance */}
                  <div className="text-right flex-shrink-0">
                    <div
                      className="font-bold text-sm"
                      style={{ color: cfg.color }}
                    >
                      {isCredit ? '+' : ''}{tx.amount}
                    </div>
                    <div className="text-xs text-white/30">bal: {tx.balanceAfter}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
