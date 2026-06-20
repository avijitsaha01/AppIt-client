import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { Button } from '@/components/ui/button'
import type { Portfolio } from '@/types'
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react'

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => api.get<{ portfolio: Portfolio }>(`/portfolios/published`).then(r => {
      const found = r.data.portfolios.find((p: Portfolio) => p.slug === slug)
      if (!found) throw new Error('Not found')
      return { portfolio: found }
    }),
    enabled: !!slug,
  })

  const portfolio = data?.portfolio

  if (isLoading) return <LoadingSkeleton className="min-h-[60vh]" />
  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Project not found</h2>
        <p className="mt-2 text-neutral-500">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-6 rounded-full" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title={portfolio.title}
        subtitle={portfolio.description}
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Link to="/portfolio" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>

          {portfolio.image && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-neutral-100">
              <img src={portfolio.image} alt={portfolio.title} className="w-full object-cover" />
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">About This Project</h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-600">{portfolio.description}</p>
              </div>
              {portfolio.impact && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Business Impact</h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-600">{portfolio.impact}</p>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {portfolio.client && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Client</h2>
                  <p className="mt-2 text-neutral-900 font-medium">{portfolio.client}</p>
                </div>
              )}
              {portfolio.url && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Live Site</h2>
                  <a
                    href={portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-medium text-sm"
                  >
                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
              {portfolio.techUsed && portfolio.techUsed.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Technologies</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {portfolio.techUsed.map((tech) => (
                      <span key={tech} className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              className="h-12 rounded-full bg-neutral-900 px-8 text-sm text-white hover:bg-neutral-800"
              onClick={() => window.location.href = '/contact'}
            >
              Start a Similar Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
