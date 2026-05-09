function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} aria-hidden="true" />
}

export default function UploadLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-5" aria-label="Loading upload page..." aria-busy="true">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Credit warning */}
      <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 flex items-center gap-3">
        <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
        <Skeleton className="h-4 flex-1" />
      </div>

      {/* Drop zone */}
      <div className="upload-zone !cursor-default pointer-events-none">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-5 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>

      {/* Action button */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* Tips card */}
      <div className="glass-card p-5 space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="w-3 h-4 rounded flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
