import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Product } from '@/types'
import { Package, Plus, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ManageProducts() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', features: '', pricing: '', trialLink: '', status: 'active' as 'active' | 'inactive' })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<{ products: Product[] }>('/products').then(r => r.data.products),
  })

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => api.post('/products', fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => api.put(`/products/${id}`, fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const resetForm = () => {
    setShowForm(false); setEditing(null)
    setForm({ name: '', description: '', features: '', pricing: '', trialLink: '', status: 'active' })
    setFile(null); setPreview(null)
  }

  const openEdit = (p: Product) => {
    setEditing(p); setForm({ name: p.name, description: p.description, features: p.features?.join(', ') || '', pricing: p.pricing, trialLink: p.trialLink || '', status: p.status })
    setPreview(p.image || null); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name); fd.append('description', form.description); fd.append('pricing', form.pricing)
    fd.append('status', form.status)
    if (form.features) form.features.split(',').forEach(f => fd.append('features', f.trim()))
    if (form.trialLink) fd.append('trialLink', form.trialLink)
    if (file) fd.append('image', file)
    if (editing) updateMutation.mutate({ id: editing._id, fd })
    else createMutation.mutate(fd)
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Manage Products</h1>
          <p className="mt-1 text-[13px] text-neutral-500">Add and manage your product catalog.</p>
        </div>
        <Button className="h-8 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => { setEditing(null); resetForm(); setShowForm(true) }}>
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      {!products?.length ? (
        <EmptyState icon={Package} title="No products yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Pricing</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p._id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.image ? <img src={p.image} alt="" className="h-8 w-8 rounded-md object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100"><Package className="h-4 w-4 text-neutral-500" /></div>}
                      <span className="text-[13px] font-medium text-neutral-900 truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900">{p.pricing}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium', p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600')}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600" onClick={() => openEdit(p)}>Edit</button>
                      <button className="text-[12px] font-medium text-red-500 hover:text-red-600" onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p._id) }}>Delete</button>
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
              <h3 className="text-lg font-semibold text-neutral-900">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={resetForm} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Product Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="h-9 text-[13px]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-400" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Pricing</Label>
                  <Input value={form.pricing} onChange={(e) => setForm(f => ({ ...f, pricing: e.target.value }))} placeholder="e.g. $49/mo" className="h-9 text-[13px]" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Status</Label>
                  <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] outline-none focus:border-neutral-400">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Features (comma separated)</Label>
                <Input value={form.features} onChange={(e) => setForm(f => ({ ...f, features: e.target.value }))} placeholder="e.g. Real-time analytics, Team collaboration, API access" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Trial Link (optional)</Label>
                <Input value={form.trialLink} onChange={(e) => setForm(f => ({ ...f, trialLink: e.target.value }))} className="h-9 text-[13px]" />
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
                {editing ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
