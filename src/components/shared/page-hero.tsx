import { cn } from '@/lib/utils'

interface PageHeroProps {
  title: string
  subtitle?: string
  label?: string
  dark?: boolean
  className?: string
}

export function PageHero({ title, subtitle, label, dark, className }: PageHeroProps) {
  return (
    <section className={cn(
      'relative overflow-hidden py-24 md:py-32',
      dark ? 'bg-neutral-950' : 'bg-white',
      className,
    )}>
      {dark && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)]" />
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        {label && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium"
            style={{ backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: dark ? 'rgba(255,255,255,0.6)' : '#525252' }}>
            {label}
          </div>
        )}
        <h1 className={cn(
          'text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl',
          dark ? 'text-white' : 'text-neutral-900',
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn(
            'mx-auto mt-5 max-w-2xl text-base leading-relaxed md:text-lg',
            dark ? 'text-white/40' : 'text-neutral-500',
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
