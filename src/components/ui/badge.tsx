import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-900 text-white shadow',
        secondary: 'border-transparent bg-neutral-100 text-neutral-900',
        destructive: 'border-transparent bg-red-500 text-white shadow',
        outline: 'text-neutral-950',
        pending: 'border-transparent bg-yellow-100 text-yellow-800',
        ongoing: 'border-transparent bg-blue-100 text-blue-800',
        done: 'border-transparent bg-green-100 text-green-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
