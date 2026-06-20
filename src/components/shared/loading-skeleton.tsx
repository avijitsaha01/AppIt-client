import { cn } from '@/lib/utils'

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-100 bg-white p-8">
      <div className="mb-4 h-14 w-14 rounded-2xl bg-neutral-100" />
      <div className="mb-3 h-5 w-3/4 rounded bg-neutral-100" />
      <div className="mb-2 h-4 w-full rounded bg-neutral-100" />
      <div className="h-4 w-2/3 rounded bg-neutral-100" />
    </div>
  )
}
