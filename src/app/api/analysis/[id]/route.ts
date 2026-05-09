import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analysis = await prisma.analysis.findFirst({
      where: { id, userId: session.user.id },
      include: {
        resume: {
          select: { fileName: true, fileType: true, uploadedAt: true },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    return NextResponse.json({ analysis })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 })
  }
}
