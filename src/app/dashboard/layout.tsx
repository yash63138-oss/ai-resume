import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getInitials } from '@/lib/utils'
import DashboardShell from './DashboardShell'

async function getWalletBalance(userId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: { balance: true },
  })
  return wallet?.balance ?? 0
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const balance = await getWalletBalance(session.user.id!)
  const userInitials = getInitials(session.user.name || session.user.email || 'U')
  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'

  return (
    <DashboardShell
      balance={balance}
      userName={session.user.name || ''}
      userEmail={session.user.email || ''}
      userInitials={userInitials}
      isAdmin={isAdmin}
    >
      {children}
    </DashboardShell>
  )
}
