function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} aria-hidden="true" />
}

export default function AnalysisLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6" aria-label="Loading analysis..." aria-busy="true">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score ring placeholders */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center gap-4">
            <Skeleton className="w-28 h-28 rounded-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
        {/* Quick stats */}
        <div className="glass-card p-6 space-y-4">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Section scores */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass-card p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-44" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-xl border border-white/[0.04]">
            <Skeleton className="w-6 h-6 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Keywords grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex flex-wrap gap-2">
              {['w-16', 'w-20', 'w-24', 'w-28', 'w-16', 'w-24', 'w-20', 'w-28'].map((w, j) => (
                <Skeleton key={j} className={`h-7 rounded-full ${w}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
