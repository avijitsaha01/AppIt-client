import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Job } from '@/types'
import { Briefcase, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig: Record<string, string> = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  'contract': 'bg-amber-100 text-amber-700',
  'internship': 'bg-emerald-100 text-emerald-700',
}

export default function ManageJobs() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)
  const [form, setForm] = useState({ title: '', type: 'full-time' as Job['type'], location: '', description: '', requirements: '', deadline: '', status: 'open' as 'open' | 'closed' })

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get<{ jobs: Job[] }>('/jobs').then(r => r.data.jobs),
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/jobs', { ...form, requirements: form.requirements.split(',').map(s => s.trim()).filter(Boolean), deadline: new Date(form.deadline).toISOString() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jobs'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: () => api.put(`/jobs/${editing!._id}`, { ...form, requirements: form.requirements.split(',').map(s => s.trim()).filter(Boolean), deadline: new Date(form.deadline).toISOString() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jobs'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/jobs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const resetForm = () => {
    setShowForm(false); setEditing(null)
    setForm({ title: '', type: 'full-time', location: '', description: '', requirements: '', deadline: '', status: 'open' })
  }

  const openEdit = (j: Job) => {
    setEditing(j); setForm({ title: j.title, type: j.type, location: j.location, description: j.description, requirements: j.requirements?.join(', ') || '', deadline: new Date(j.deadline).toISOString().split('T')[0], status: j.status })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateMutation.mutate()
    else createMutation.mutate()
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Manage Jobs</h1>
          <p className="mt-1 text-[13px] text-neutral-500">Post and manage job openings.</p>
        </div>
        <Button className="h-8 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => { setEditing(null); resetForm(); setShowForm(true) }}>
          <Plus className="h-3.5 w-3.5" /> New Job
        </Button>
      </div>

      {!jobs?.length ? (
        <EmptyState icon={Briefcase} title="No job openings yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Title</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Type</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Location</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {jobs.map((j) => (
                <tr key={j._id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900">{j.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', typeConfig[j.type])}>{j.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">{j.location}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium', j.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600')}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600" onClick={() => openEdit(j)}>Edit</button>
                      <button className="text-[12px] font-medium text-red-500 hover:text-red-600" onClick={() => { if (confirm('Delete this job?')) deleteMutation.mutate(j._id) }}>Delete</button>
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
              <h3 className="text-lg font-semibold text-neutral-900">{editing ? 'Edit Job' : 'New Job'}</h3>
              <button onClick={resetForm} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Job Title</Label>
                  <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Type</Label>
                  <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value as any }))} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] outline-none focus:border-neutral-400">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Location</Label>
                  <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Deadline</Label>
                  <Input type="date" value={form.deadline} onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))} className="h-9 text-[13px]" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-400" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Requirements (comma separated)</Label>
                <Input value={form.requirements} onChange={(e) => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="e.g. 3+ years React, TypeScript, Node.js" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Status</Label>
                <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))} className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] outline-none focus:border-neutral-400">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-9 w-full gap-2 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
                {editing ? 'Update Job' : 'Post Job'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
