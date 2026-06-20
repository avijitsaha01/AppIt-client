import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import type { BlogPost } from '@/types'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default function BlogList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', 'published'],
    queryFn: () => api.get<{ posts: BlogPost[] }>('/blog-posts/published').then(r => r.data.posts),
  })

  const featured = posts?.[0]

  return (
    <div>
      <PageHero
        label="Our Blog"
        title="Insights, stories, and tutorials"
        subtitle="Stay updated with the latest in tech, design, and digital strategy."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !posts?.length ? (
            <EmptyState title="No blog posts yet" description="We're working on some great content. Check back soon!" />
          ) : (
            <>
              {featured && (
                <Link
                  to={`/blog/${featured.slug}`}
                  className="mb-12 block overflow-hidden rounded-2xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100 md:aspect-auto">
                      {featured.image ? (
                        <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-200 text-lg">No image</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <span className="mb-3 inline-flex w-fit rounded-full bg-blue-100 px-3 py-0.5 text-[11px] font-medium text-blue-600">Featured</span>
                      <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">{featured.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-500">{featured.excerpt}</p>
                      <div className="mt-6 flex items-center gap-4 text-[12px] text-neutral-400">
                        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {featured.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-blue-500">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(featured ? posts.slice(1) : posts).map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-2xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-200">No image</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-neutral-900 line-clamp-2">{post.title}</h3>
                      <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
