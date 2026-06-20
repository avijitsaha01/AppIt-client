import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/types'
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => api.get<{ post: BlogPost }>(`/blog-posts/slug/${slug}`).then(r => r.data.post),
    enabled: !!slug,
  })

  const { data: allPosts } = useQuery({
    queryKey: ['blog-posts', 'published'],
    queryFn: () => api.get<{ posts: BlogPost[] }>('/blog-posts/published').then(r => r.data.posts),
  })

  const related = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || []

  if (isLoading) return <LoadingSkeleton className="min-h-[60vh]" />
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Post not found</h2>
        <p className="mt-2 text-neutral-500">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-6 rounded-full" onClick={() => window.location.href = '/blog'}>Browse Blog</Button>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-3xl px-5">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {post.image && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-neutral-100">
              <img src={post.image} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-neutral-400">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-500">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-neutral max-w-none pb-16 border-b border-neutral-100">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="mt-8 mb-4 text-2xl font-bold text-neutral-900">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="mt-6 mb-3 text-xl font-semibold text-neutral-900">{line.slice(4)}</h3>
              if (line.startsWith('- ')) return <li key={i} className="text-neutral-600 ml-4">{line.slice(2)}</li>
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="mb-4 leading-relaxed text-neutral-600">{line}</p>
            })}
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-neutral-900">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/blog/${rp.slug}`}
                  className="group overflow-hidden rounded-xl border border-neutral-100 transition-all hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                    {rp.image ? (
                      <img src={rp.image} alt={rp.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-200">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">{rp.title}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[12px] text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      Read More <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
