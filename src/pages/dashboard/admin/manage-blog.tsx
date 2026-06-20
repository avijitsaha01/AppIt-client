import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { BlogPost } from '@/types'
import { FileText, Plus, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ManageBlog() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', author: '', tags: '', status: 'draft' as 'draft' | 'published' })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', 'all'],
    queryFn: () => api.get<{ posts: BlogPost[] }>('/blog-posts').then(r => r.data.posts),
  })

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => api.post('/blog-posts', fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blog-posts'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => api.put(`/blog-posts/${id}`, fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blog-posts'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blog-posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  })

  const resetForm = () => {
    setShowForm(false); setEditing(null)
    setForm({ title: '', slug: '', content: '', excerpt: '', author: '', tags: '', status: 'draft' })
    setFile(null); setPreview(null)
  }

  const openEdit = (p: BlogPost) => {
    setEditing(p); setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt, author: p.author, tags: p.tags?.join(', ') || '', status: p.status })
    setPreview(p.image || null); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title); fd.append('slug', form.slug); fd.append('content', form.content)
    fd.append('excerpt', form.excerpt); fd.append('author', form.author)
    fd.append('status', form.status)
    if (form.tags) form.tags.split(',').forEach(t => fd.append('tags', t.trim()))
    if (file) fd.append('image', file)
    if (editing) updateMutation.mutate({ id: editing._id, fd })
    else createMutation.mutate(fd)
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Manage Blog</h1>
          <p className="mt-1 text-[13px] text-neutral-500">Create and manage blog posts.</p>
        </div>
        <Button className="h-8 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => { setEditing(null); resetForm(); setShowForm(true) }}>
          <Plus className="h-3.5 w-3.5" /> New Post
        </Button>
      </div>

      {!posts?.length ? (
        <EmptyState icon={FileText} title="No blog posts yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Title</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Author</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map((p) => (
                <tr key={p._id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-neutral-900 truncate max-w-[250px]">{p.title}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">{p.author}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium', p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-500">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600" onClick={() => openEdit(p)}>Edit</button>
                      <button className="text-[12px] font-medium text-red-500 hover:text-red-600" onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(p._id) }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => resetForm()}>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">{editing ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={resetForm} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Excerpt</Label>
                <Input value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} className="h-9 text-[13px]" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Author</Label>
                  <Input value={form.author} onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Status</Label>
                  <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] outline-none focus:border-neutral-400">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} className="h-9 text-[13px]" placeholder="e.g. tech, design, tutorial" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Content (Markdown)</Label>
                <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={10} className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] font-mono outline-none focus:border-neutral-400" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Image</Label>
                {preview ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                    <img src={preview} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setFile(null); setPreview(null) }} className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3.5 text-[13px] text-neutral-500 hover:border-neutral-400">
                    <Upload className="h-3.5 w-3.5" /> Upload image
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); const r = new FileReader(); r.onloadend = () => setPreview(r.result as string); r.readAsDataURL(f) } }} className="hidden" />
                  </label>
                )}
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-9 w-full gap-2 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
                {editing ? 'Update Post' : 'Create Post'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
