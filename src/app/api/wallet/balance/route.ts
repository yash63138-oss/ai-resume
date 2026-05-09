import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { balance: true, updatedAt: true },
    })

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      updatedAt: wallet?.updatedAt,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wallet balance' }, { status: 500 })
  }
}
