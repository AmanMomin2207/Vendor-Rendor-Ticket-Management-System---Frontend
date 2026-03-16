import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-lg', className)} />
}

export function StatSkeleton() {
  return (
    <div className="glass rounded-xl p-5 border border-white/5">
      <Skeleton className="w-9 h-9 rounded-lg mb-3" />
      <Skeleton className="w-16 h-7 mb-2" />
      <Skeleton className="w-24 h-3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="w-full h-12" />
      ))}
    </div>
  )
}
