import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: session.user.id },
      orderBy: { analyzedAt: 'desc' },
      include: {
        resume: { select: { fileName: true, fileType: true } },
      },
    })

    return NextResponse.json({ analyses })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
  }
}
