import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { TeamMember } from '@/types'
import { Users, Plus, Upload, X } from 'lucide-react'

export default function ManageTeam() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ name: '', role: '', bio: '', order: 0 })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => api.get<{ members: TeamMember[] }>('/team-members').then(r => r.data.members),
  })

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => api.post('/team-members', fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team-members'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => api.put(`/team-members/${id}`, fd),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team-members'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/team-members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-members'] }),
  })

  const resetForm = () => {
    setShowForm(false); setEditing(null); setForm({ name: '', role: '', bio: '', order: 0 })
    setFile(null); setPreview(null)
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m); setForm({ name: m.name, role: m.role, bio: m.bio, order: m.order })
    setPreview(m.image || null); setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name); fd.append('role', form.role); fd.append('bio', form.bio)
    fd.append('order', String(form.order))
    if (file) fd.append('image', file)
    if (editing) updateMutation.mutate({ id: editing._id, fd })
    else createMutation.mutate(fd)
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Manage Team</h1>
          <p className="mt-1 text-[13px] text-neutral-500">Add and manage team members.</p>
        </div>
        <Button className="h-8 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => { setEditing(null); setForm({ name: '', role: '', bio: '', order: 0 }); setPreview(null); setShowForm(true) }}>
          <Plus className="h-3.5 w-3.5" /> Add Member
        </Button>
      </div>

      {!members?.length ? (
        <EmptyState icon={Users} title="No team members yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m._id} className="rounded-xl border border-neutral-200/70 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                  {m.image ? <img src={m.image} alt={m.name} className="h-full w-full object-cover" /> : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-neutral-500">{m.name[0]}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-neutral-900 truncate">{m.name}</p>
                  <p className="text-[12px] text-blue-500">{m.role}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-neutral-500 line-clamp-2">{m.bio}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => openEdit(m)}>Edit</Button>
                <Button variant="destructive" size="sm" className="h-7 text-[11px]" onClick={() => { if (confirm('Delete this member?')) deleteMutation.mutate(m._id) }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => resetForm()}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">{editing ? 'Edit Member' : 'Add Member'}</h3>
              <button onClick={resetForm} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="h-9 text-[13px]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Role</Label>
                <Input value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} className="h-9 text-[13px]" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Bio</Label>
                <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-400" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="h-9 text-[13px]" />
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
                {editing ? 'Update Member' : 'Add Member'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
