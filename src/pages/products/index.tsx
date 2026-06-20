import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'
import { Check, ArrowRight, ExternalLink } from 'lucide-react'

export default function Products() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'active'],
    queryFn: () => api.get<{ products: Product[] }>('/products/active').then(r => r.data.products),
  })

  return (
    <div>
      <PageHero
        label="Our Products"
        title="Powerful tools built for modern businesses"
        subtitle="Explore our suite of products designed to streamline your operations and accelerate growth."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !products?.length ? (
            <EmptyState title="No products available yet" description="Check back soon for our product lineup." />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product._id} className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl">
                  {product.image && (
                    <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-neutral-50">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-neutral-900">{product.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-6 space-y-2">
                      {product.features.slice(0, 4).map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-[13px] text-neutral-600">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 border-t border-neutral-100 pt-6">
                    <p className="text-2xl font-bold text-neutral-900">{product.pricing}</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1 rounded-full bg-neutral-900 text-sm hover:bg-neutral-800">
                      Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    {product.trialLink && (
                      <a href={product.trialLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full border-neutral-300">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
