import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import WalletClient from './WalletClient'
import { Suspense } from 'react'

export default async function WalletPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [wallet, transactions] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: session.user.id! } }),
    prisma.transaction.findMany({
      where: { userId: session.user.id! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  return (
    <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-2xl h-64 w-full" />}>
      <WalletClient
        balance={wallet?.balance ?? 0}
        transactions={transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          balanceAfter: t.balanceAfter,
          description: t.description,
          createdAt: t.createdAt,
        }))}
        userName={session.user.name || ''}
        userEmail={session.user.email || ''}
      />
    </Suspense>
  )
}
