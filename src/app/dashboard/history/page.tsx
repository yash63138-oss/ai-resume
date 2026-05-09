import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, FileText, BarChart3, TrendingUp, Upload } from 'lucide-react'
import { getScoreColor, getScoreLabel, formatDateTime } from '@/lib/utils'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id! },
    orderBy: { analyzedAt: 'desc' },
    include: {
      resume: { select: { fileName: true, fileType: true } },
    },
  })

  const avgScore = analyses.length
    ? Math.round(analyses.reduce((a, b) => a + b.overallScore, 0) / analyses.length)
    : 0

  const bestScore = analyses.length ? Math.max(...analyses.map((a) => a.overallScore)) : 0

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Analysis History</h1>
          <p className="text-white/40 text-sm mt-1">All your resume analyses in one place</p>
        </div>
        <Link href="/dashboard/upload" className="btn-primary text-sm flex-shrink-0">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">New Analysis</span>
          <ArrowRight className="w-4 h-4 sm:hidden" />
        </Link>
      </div>

      {/* Stats Row */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span className="text-white/50 text-xs sm:text-sm">Total</span>
            </div>
            <div className="font-display font-bold text-2xl sm:text-3xl gradient-text">{analyses.length}</div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-white/50 text-xs sm:text-sm">Average</span>
            </div>
            <div className="font-display font-bold text-2xl sm:text-3xl" style={{ color: getScoreColor(avgScore) }}>{avgScore}</div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-white/50 text-xs sm:text-sm">Best</span>
            </div>
            <div className="font-display font-bold text-2xl sm:text-3xl" style={{ color: getScoreColor(bestScore) }}>{bestScore}</div>
          </div>
        </div>
      )}

      {/* Analysis List */}
      {analyses.length === 0 ? (
        <div className="glass-card p-12 sm:p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-brand-400" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">No analyses yet</h2>
          <p className="text-white/40 max-w-sm mb-8 text-sm">
            Upload your first resume to see AI-powered analysis and suggestions here.
          </p>
          <Link href="/dashboard/upload" className="btn-primary">
            Analyze Your First Resume
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <div className="sm:hidden space-y-3">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analysis/${analysis.id}`}
                className="glass-card-hover p-4 flex items-center gap-4 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                  style={{
                    background: `${getScoreColor(analysis.overallScore)}15`,
                    color: getScoreColor(analysis.overallScore),
                    border: `1px solid ${getScoreColor(analysis.overallScore)}30`,
                  }}
                >
                  {analysis.overallScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{analysis.resume.fileName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs uppercase text-white/30">{analysis.resume.fileType}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-xs text-white/30">ATS: {analysis.atsScore}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-xs" style={{ color: getScoreColor(analysis.overallScore) }}>
                      {getScoreLabel(analysis.overallScore)}
                    </span>
                  </div>
                  <div className="text-xs text-white/25 mt-0.5">{formatDateTime(analysis.analyzedAt)}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden sm:block glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Resume</th>
                    <th>Overall</th>
                    <th>ATS Score</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((analysis) => (
                    <tr key={analysis.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-brand-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm truncate max-w-[180px]">{analysis.resume.fileName}</div>
                            <div className="text-xs text-white/30 uppercase">{analysis.resume.fileType}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: getScoreColor(analysis.overallScore) }}>
                            {analysis.overallScore}
                          </span>
                          <span className="text-xs text-white/30">{getScoreLabel(analysis.overallScore)}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: getScoreColor(analysis.atsScore) }} className="font-medium">
                          {analysis.atsScore}
                        </span>
                      </td>
                      <td className="text-white/40 text-xs whitespace-nowrap">{formatDateTime(analysis.analyzedAt)}</td>
                      <td>
                        <Link href={`/analysis/${analysis.id}`} className="btn-ghost text-xs py-1.5 px-3 whitespace-nowrap">
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
