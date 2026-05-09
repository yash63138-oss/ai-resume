import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Upload,
  TrendingUp,
  Coins,
  History,
  ArrowRight,
  Brain,
  FileText,
  Zap,
  Award,
  BarChart3
} from 'lucide-react'
import { formatDate, getScoreColor, getScoreLabel, formatFileSize } from '@/lib/utils'

async function getDashboardData(userId: string) {
  const [wallet, analyses, recentResumes] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { analyzedAt: 'desc' },
      take: 10,
      include: { resume: { select: { fileName: true } } },
    }),
    prisma.resume.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
      take: 3,
      select: { id: true, fileName: true, fileSizeKb: true, uploadedAt: true },
    }),
  ])
  return { wallet, analyses, recentResumes }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { wallet, analyses, recentResumes } = await getDashboardData(session.user.id!)
  const latestAnalysis = analyses[0]
  const avgScore = analyses.length
    ? Math.round(analyses.slice(0, 5).reduce((a, b) => a + b.overallScore, 0) / Math.min(5, analyses.length))
    : 0

  const stats = [
    {
      label: 'Available Credits',
      value: wallet?.balance ?? 0,
      subtext: 'analyses remaining',
      icon: Coins,
      color: '#4f5eff',
      href: '/dashboard/wallet',
    },
    {
      label: 'Total Analyses',
      value: analyses.length,
      subtext: 'resumes analyzed',
      icon: BarChart3,
      color: '#8b5cf6',
      href: '/dashboard/history',
    },
    {
      label: 'Latest Score',
      value: latestAnalysis ? `${latestAnalysis.overallScore}/100` : '—',
      subtext: latestAnalysis ? getScoreLabel(latestAnalysis.overallScore) : 'No analysis yet',
      icon: Award,
      color: latestAnalysis ? getScoreColor(latestAnalysis.overallScore) : '#ffffff40',
      href: latestAnalysis ? `/analysis/${latestAnalysis.id}` : '/dashboard/upload',
    },
    {
      label: 'Avg Score (Last 5)',
      value: analyses.length ? `${avgScore}/100` : '—',
      subtext: analyses.length ? 'Keep improving!' : 'Upload to start',
      icon: TrendingUp,
      color: '#10b981',
      href: '/dashboard/history',
    },
  ]

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {wallet?.balance === 0
              ? "You're out of credits. Buy more to continue analyzing."
              : `You have ${wallet?.balance} credit${wallet?.balance === 1 ? '' : 's'} available.`}
          </p>
        </div>
        <Link href="/dashboard/upload" id="dashboard-analyze-btn" className="btn-primary">
          <Upload className="w-4 h-4" />
          Analyze Resume
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card glass-card-hover group">
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <div>
              <div className="font-display font-bold text-2xl" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-white/40 text-xs">{stat.label}</div>
              <div className="text-white/20 text-xs mt-0.5">{stat.subtext}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-sm mb-4 text-white/60">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/upload" id="quick-upload-btn" className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Upload & Analyze</div>
                <div className="text-xs text-white/40">Costs 1 credit</div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/60 transition-colors" />
            </Link>

            <Link href="/dashboard/wallet" id="quick-buy-credits-btn" className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Buy Credits</div>
                <div className="text-xs text-white/40">Starting at ₹99</div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/60 transition-colors" />
            </Link>

            <Link href="/dashboard/history" id="quick-history-btn" className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <History className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm">View History</div>
                <div className="text-xs text-white/40">{analyses.length} analyses</div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/60 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm text-white/60">Recent Analyses</h2>
            <Link href="/dashboard/history" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>

          {analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="font-semibold mb-2">No analyses yet</h3>
              <p className="text-sm text-white/40 mb-6 max-w-xs">
                Upload your first resume to get an AI-powered analysis with score and suggestions.
              </p>
              <Link href="/dashboard/upload" className="btn-primary text-sm">
                <Zap className="w-4 h-4" />
                Analyze My First Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/analysis/${analysis.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: `${getScoreColor(analysis.overallScore)}20`,
                      color: getScoreColor(analysis.overallScore),
                      border: `1px solid ${getScoreColor(analysis.overallScore)}30`
                    }}
                  >
                    {analysis.overallScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{analysis.resume.fileName}</div>
                    <div className="text-xs text-white/30">{formatDate(analysis.analyzedAt)}</div>
                  </div>
                  <div className="text-xs text-white/20 group-hover:text-white/60 transition-colors">
                    {getScoreLabel(analysis.overallScore)}
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* No credits CTA */}
      {wallet?.balance === 0 && (
        <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold">You&apos;re out of credits</div>
              <div className="text-sm text-white/40">Buy credits to continue analyzing resumes.</div>
            </div>
          </div>
          <Link href="/dashboard/wallet" id="out-of-credits-cta" className="btn-primary flex-shrink-0">
            Buy Credits <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
