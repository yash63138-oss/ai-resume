// Reusable skeleton primitives
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 space-y-3" aria-hidden="true">
      {children}
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-label="Loading dashboard..." aria-busy="true">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-start justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-4 h-4" />
            </div>
            <Skeleton className="h-8 w-20 mt-2" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </SkeletonCard>
        ))}
      </div>

      {/* Quick Actions + History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard>
          <Skeleton className="h-4 w-28 mb-2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.04]">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </SkeletonCard>

        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
