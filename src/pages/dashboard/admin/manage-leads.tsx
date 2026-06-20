import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { ContactRequest } from '@/types'
import { cn } from '@/lib/utils'
import { MessageSquare, Mail } from 'lucide-react'

const statusConfig: Record<string, string> = {
  unread: 'bg-red-50 text-red-700',
  read: 'bg-blue-50 text-blue-700',
  replied: 'bg-emerald-50 text-emerald-700',
}

export default function ManageLeads() {
  const queryClient = useQueryClient()

  const { data: requests, isLoading } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: () => api.get<{ requests: ContactRequest[] }>('/contact-requests').then(r => r.data.requests),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/contact-requests/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contact-requests'] }),
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Contact Requests</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Manage incoming contact inquiries.</p>
      </div>

      {!requests?.length ? (
        <EmptyState icon={MessageSquare} title="No contact requests yet" />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="rounded-xl border border-neutral-200/70 bg-white p-5 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-[14px] font-semibold text-neutral-900">{req.name}</p>
                    <a href={`mailto:${req.email}`} className="text-[12px] text-blue-500 hover:text-blue-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {req.email}
                    </a>
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-neutral-700">{req.subject}</p>
                  <p className="mt-1 text-[12px] text-neutral-500">{req.message}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      value={req.status}
                      onChange={(e) => statusMutation.mutate({ id: req._id, status: e.target.value })}
                      className={cn('rounded-full border-0 px-2.5 py-0.5 text-[11px] font-medium outline-none', statusConfig[req.status])}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {req.phone && <span className="shrink-0 text-[12px] text-neutral-400">{req.phone}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
