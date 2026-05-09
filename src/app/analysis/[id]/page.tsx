import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Lightbulb,
  BarChart3,
} from 'lucide-react'
import { getScoreColor, getScoreLabel, formatDateTime } from '@/lib/utils'

async function getAnalysis(id: string, userId: string) {
  return prisma.analysis.findFirst({
    where: { id, userId },
    include: {
      resume: {
        select: { fileName: true, fileType: true, uploadedAt: true },
      },
    },
  })
}

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        aria-label={`Score: ${score} out of 100`}
        role="img"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-white/40">/100</span>
      </div>
    </div>
  )
}

function SectionScore({ label, score }: { label: string; score: number }) {
  const color = getScoreColor(score)
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">{label}</span>
        <span className="font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${score}%`, background: color }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

const SECTION_LABELS: Record<string, string> = {
  contact_info: 'Contact Info',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  formatting: 'Formatting & Structure',
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params
  const analysis = await getAnalysis(id, session.user.id!)
  if (!analysis) notFound()

  const sectionScores = analysis.sectionScores as Record<string, number>
  const suggestions = analysis.suggestions as string[]
  const keywordsFound = analysis.keywordsFound as string[]
  const keywordsMissing = analysis.keywordsMissing as string[]

  const scoreColor = getScoreColor(analysis.overallScore)

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-in">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/history" className="btn-ghost p-2 flex-shrink-0" aria-label="Back to history">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-base sm:text-xl truncate">
            {analysis.resume.fileName}
          </h1>
          <p className="text-white/40 text-xs sm:text-sm">{formatDateTime(analysis.analyzedAt)}</p>
        </div>
        <button
          id="download-pdf-btn"
          className="btn-secondary text-sm flex-shrink-0"
          aria-label="Download PDF report"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      {/* ── Score Cards ───────────────────────────────── */}
      {/* Mobile: horizontal flex row; Desktop: 3-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Overall Score */}
        <div className="glass-card p-5 sm:p-6 flex flex-col items-center text-center">
          <ScoreRing score={analysis.overallScore} size={120} />
          <div className="mt-3 space-y-1">
            <div className="font-semibold text-sm">{getScoreLabel(analysis.overallScore)}</div>
            <div className="text-xs text-white/40">Overall Score</div>
          </div>
          <div
            className="badge mt-3 text-xs"
            style={{
              background: `${scoreColor}15`,
              color: scoreColor,
              border: `1px solid ${scoreColor}30`,
            }}
          >
            {getScoreLabel(analysis.overallScore)}
          </div>
        </div>

        {/* ATS Score */}
        <div className="glass-card p-5 sm:p-6 flex flex-col items-center text-center">
          <ScoreRing score={analysis.atsScore} size={100} />
          <div className="mt-3 space-y-1">
            <div className="font-semibold text-sm">ATS Score</div>
            <div className="text-xs text-white/40">Applicant Tracking</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-5 sm:p-6 space-y-3">
          <div className="text-xs font-semibold text-white/30 uppercase tracking-widest">Quick Stats</div>
          {[
            { label: 'File Type', value: analysis.resume.fileType.toUpperCase(), color: 'text-white' },
            { label: 'Keywords Found', value: keywordsFound.length.toString(), color: 'text-emerald-400' },
            { label: 'Keywords Missing', value: keywordsMissing.length.toString(), color: 'text-red-400' },
            { label: 'Suggestions', value: suggestions.length.toString(), color: 'text-amber-400' },
            { label: 'AI Model', value: analysis.aiModel, color: 'text-brand-400' },
          ].map((s) => (
            <div key={s.label} className="flex justify-between items-center text-sm">
              <span className="text-white/50">{s.label}</span>
              <span className={`font-medium ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section Scores ────────────────────────────── */}
      <div className="glass-card p-5 sm:p-6">
        <h2 className="font-display font-semibold flex items-center gap-2 mb-5 text-sm sm:text-base">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
          Section Scores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Object.entries(sectionScores).map(([key, score]) => (
            <SectionScore key={key} label={SECTION_LABELS[key] || key} score={score as number} />
          ))}
        </div>
      </div>

      {/* ── Suggestions ───────────────────────────────── */}
      <div className="glass-card p-5 sm:p-6">
        <h2 className="font-display font-semibold flex items-center gap-2 mb-4 text-sm sm:text-base">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          Actionable Suggestions
          <span className="badge-warning ml-auto">{suggestions.length}</span>
        </h2>
        <div className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/5 transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keywords ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Found */}
        <div className="glass-card p-5 sm:p-6">
          <h2 className="font-display font-semibold flex items-center gap-2 mb-4 text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            Keywords Found
            <span className="badge-success ml-auto">{keywordsFound.length}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {keywordsFound.length === 0 ? (
              <p className="text-sm text-white/30">No relevant keywords detected</p>
            ) : (
              keywordsFound.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="glass-card p-5 sm:p-6">
          <h2 className="font-display font-semibold flex items-center gap-2 mb-4 text-sm sm:text-base">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            Keywords Missing
            <span className="badge-error ml-auto">{keywordsMissing.length}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {keywordsMissing.length === 0 ? (
              <p className="text-sm text-white/30">
                Great! All important keywords are present.
              </p>
            ) : (
              keywordsMissing.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"
                >
                  + {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <div className="font-semibold text-sm sm:text-base">Ready to improve?</div>
          <p className="text-sm text-white/40 mt-1">
            Apply the suggestions above and re-analyze to track your progress.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          id="analysis-reanalyze-btn"
          className="btn-primary flex-shrink-0 text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          Re-Analyze
        </Link>
      </div>
    </div>
  )
}
