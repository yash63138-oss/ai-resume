function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} aria-hidden="true" />
}

export default function WalletLoading() {
  return (
    <div className="space-y-6" aria-label="Loading wallet..." aria-busy="true">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Balance hero card */}
      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-16 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Pack grid */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card px-4 py-3 flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-8 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
