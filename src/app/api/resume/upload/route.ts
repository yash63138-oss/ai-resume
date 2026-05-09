import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadResumeFile, validateFileType, validateFileSize } from '@/lib/supabase'
import { extractTextFromResume, validateResumeLength } from '@/lib/pdf-parser'
import { bytesToKb } from '@/lib/utils'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!validateFileType(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX are supported.' }, { status: 400 })
    }

    // Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract text
    let extractedText: string
    try {
      extractedText = await extractTextFromResume(buffer, file.type)
    } catch {
      return NextResponse.json({ error: 'Could not read file. Please ensure it is a valid PDF or DOCX.' }, { status: 400 })
    }

    // Validate resume content
    const validation = validateResumeLength(extractedText)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    // Upload to Supabase Storage
    const { url, path } = await uploadResumeFile(buffer, file.name, session.user.id, file.type)

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: url,
        fileType: file.type.includes('pdf') ? 'pdf' : 'docx',
        fileSizeKb: bytesToKb(file.size),
        extractedText,
      },
    })

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      fileName: resume.fileName,
      wordCount: validation.wordCount,
    })
  } catch (err) {
    console.error('[UPLOAD ERROR]', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSizeKb: true,
        uploadedAt: true,
        _count: { select: { analyses: true } },
      },
    })

    return NextResponse.json({ resumes })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 })
  }
}
