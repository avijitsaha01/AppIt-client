import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import type { Portfolio } from '@/types'
import { cn } from '@/lib/utils'
import { ChevronRight, ExternalLink } from 'lucide-react'

export default function PortfolioList() {
  const [filter, setFilter] = useState('all')

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios', 'published'],
    queryFn: () => api.get<{ portfolios: Portfolio[] }>('/portfolios/published').then(r => r.data.portfolios),
  })

  const allTechs = useMemo(() => {
    if (!portfolios) return []
    const techs = new Set<string>()
    portfolios.forEach(p => p.techUsed.forEach(t => techs.add(t)))
    return Array.from(techs)
  }, [portfolios])

  const filtered = useMemo(() => {
    if (!portfolios) return []
    if (filter === 'all') return portfolios
    return portfolios.filter(p => p.techUsed.some(t => t === filter))
  }, [portfolios, filter])

  return (
    <div>
      <PageHero
        label="Portfolio"
        title="Our featured projects"
        subtitle="Explore our work and see how we've helped businesses achieve their goals."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-full px-4 py-1.5 text-[13px] font-medium transition-all',
                filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              )}
            >
              All
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-[13px] font-medium transition-all',
                  filter === tech ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                )}
              >
                {tech}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : !filtered.length ? (
            <EmptyState title="No projects found" description={filter !== 'all' ? 'Try a different filter.' : undefined} />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <Link
                  key={project._id}
                  to={`/portfolio/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-300">
                        <ExternalLink className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900">{project.title}</h3>
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{project.description}</p>
                    {project.techUsed && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techUsed.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                            {tech}
                          </span>
                        ))}
                        {project.techUsed.length > 4 && (
                          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-400">
                            +{project.techUsed.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      View Details <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
