import Groq from 'groq-sdk'

const globalForGroq = globalThis as unknown as {
  groq: Groq | undefined
}

export const groq =
  globalForGroq.groq ??
  new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })

if (process.env.NODE_ENV !== 'production') globalForGroq.groq = groq

export interface ResumeAnalysisResult {
  overall_score: number
  ats_compatibility: number
  section_scores: {
    contact_info: number
    summary: number
    experience: number
    education: number
    skills: number
    formatting: number
  }
  suggestions: string[]
  keywords_found: string[]
  keywords_missing: string[]
  strengths: string[]
  weaknesses: string[]
}

const ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer with 15+ years of HR experience.

Analyze the following resume text and return a JSON response with these exact fields:
1. overall_score (integer 0-100): comprehensive quality score
2. ats_compatibility (integer 0-100): how well it passes ATS systems
3. section_scores (object): scores for each section
   - contact_info (integer 0-100)
   - summary (integer 0-100) 
   - experience (integer 0-100)
   - education (integer 0-100)
   - skills (integer 0-100)
   - formatting (integer 0-100)
4. suggestions (array of 5-8 strings): specific, actionable improvement tips
5. keywords_found (array of strings): relevant industry keywords present
6. keywords_missing (array of strings): important keywords that should be added
7. strengths (array of 3-5 strings): what the resume does well
8. weaknesses (array of 3-5 strings): main areas needing improvement

Be specific, constructive, and data-driven in your analysis.

Resume Text:
"""
{resumeText}
"""

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
  const prompt = ANALYSIS_PROMPT.replace('{resumeText}', resumeText.slice(0, 12000))

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume analyzer. Always respond with valid JSON only. No markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from Groq')
  }

  // Strip any markdown code fences if present
  const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
  const result = JSON.parse(cleaned) as ResumeAnalysisResult

  // Validate and clamp scores
  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)))
  result.overall_score = clamp(result.overall_score)
  result.ats_compatibility = clamp(result.ats_compatibility)
  Object.keys(result.section_scores).forEach((key) => {
    (result.section_scores as Record<string, number>)[key] = clamp(
      (result.section_scores as Record<string, number>)[key]
    )
  })

  return result
}
