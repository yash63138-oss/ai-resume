import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeResume } from '@/lib/openai'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 60

const runSchema = z.object({
  resumeId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { resumeId } = runSchema.parse(body)

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    if (!resume.extractedText || resume.extractedText.length < 50) {
      return NextResponse.json({ error: 'Resume text could not be extracted. Please try uploading again.' }, { status: 400 })
    }

    // Check and deduct credits atomically
    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } })
    if (!wallet || wallet.balance < 1) {
      return NextResponse.json({ error: 'Insufficient credits. Please purchase more credits to continue.' }, { status: 402 })
    }

    // Deduct credit BEFORE analysis to prevent free usage on failure
    const [, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: 1 } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: 'DEBIT',
          amount: -1,
          balanceAfter: wallet.balance - 1,
          description: `Resume analysis: ${resume.fileName}`,
        },
      }),
    ])

    // Run AI analysis
    let analysisResult
    try {
      analysisResult = await analyzeResume(resume.extractedText)
    } catch (aiError) {
      // Refund the credit on AI failure
      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId: session.user.id },
          data: { balance: { increment: 1 } },
        }),
        prisma.transaction.create({
          data: {
            userId: session.user.id,
            type: 'REFUND',
            amount: 1,
            balanceAfter: wallet.balance, // restored
            description: 'Refund: AI analysis failed',
          },
        }),
      ])
      console.error('[AI ANALYSIS ERROR]', aiError)
      return NextResponse.json({ error: 'AI analysis failed. Your credit has been refunded.' }, { status: 500 })
    }

    // Save analysis to database
    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        transactionId: transaction.id,
        overallScore: analysisResult.overall_score,
        atsScore: analysisResult.ats_compatibility,
        sectionScores: analysisResult.section_scores,
        suggestions: analysisResult.suggestions,
        keywordsFound: analysisResult.keywords_found,
        keywordsMissing: analysisResult.keywords_missing,
        aiModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        tokensUsed: 0, // Will be updated from response
      },
    })

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      overallScore: analysis.overallScore,
      atsScore: analysis.atsScore,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    console.error('[ANALYSIS RUN ERROR]', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
