/**
 * Skeleton — animated placeholder for loading states.
 * Usage: <Skeleton className="h-4 w-32 rounded-full" />
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      role="status"
      aria-hidden="true"
      className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`}
    />
  )
}

/**
 * SkeletonText — multi-line text placeholder.
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

/**
 * SkeletonCard — glass card wrapper with a skeleton inside.
 */
export function SkeletonCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`glass-card p-6 space-y-3 ${className}`} aria-hidden="true">
      {children}
    </div>
  )
}
