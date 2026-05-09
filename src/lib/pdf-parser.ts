// pdf-parse has no proper default export type — use require() to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (
  buffer: Buffer,
  options?: Record<string, unknown>
) => Promise<{ text: string; numpages: number; info: Record<string, unknown> }>

import mammoth from 'mammoth'

/**
 * Extract plain text from a PDF file buffer.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return cleanText(data.text)
}

/**
 * Extract plain text from a DOCX/DOC file buffer.
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return cleanText(result.value)
}

/**
 * Auto-detect file type by MIME and extract text.
 */
export async function extractTextFromResume(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer)
  }

  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractTextFromDOCX(buffer)
  }

  throw new Error(
    `Unsupported file type: ${mimeType}. Please upload a PDF or DOCX file.`
  )
}

/**
 * Normalise whitespace / newlines in extracted text.
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')        // collapse 3+ blank lines
    .replace(/[^\S\n]+/g, ' ')         // collapse horizontal whitespace
    .trim()
}

export function getWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function validateResumeLength(text: string): {
  valid: boolean
  wordCount: number
  message?: string
} {
  const wordCount = getWordCount(text)

  if (wordCount < 50) {
    return {
      valid: false,
      wordCount,
      message:
        'Resume appears too short (fewer than 50 words). Please upload a complete resume.',
    }
  }

  if (wordCount > 5000) {
    return {
      valid: false,
      wordCount,
      message:
        'Resume is too long (over 5000 words). Please trim it to under 2 pages.',
    }
  }

  return { valid: true, wordCount }
}
