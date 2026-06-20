import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: any
  title: string
  description?: string
  className?: string
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center rounded-xl border border-neutral-200/70 bg-white py-16 text-neutral-400', className)}>
      {Icon && <Icon className="mb-3 h-10 w-10 stroke-[1.5]" />}
      <p className="text-[13px] font-medium text-neutral-500">{title}</p>
      {description && <p className="mt-0.5 text-[12px] text-neutral-400">{description}</p>}
    </div>
  )
}
