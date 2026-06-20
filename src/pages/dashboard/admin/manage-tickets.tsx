import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Ticket } from '@/types'
import { cn } from '@/lib/utils'
import { MessageSquare, Send, Search } from 'lucide-react'

const statusConfig: Record<string, { label: string; bg: string }> = {
  open: { label: 'Open', bg: 'bg-green-50 text-green-700' },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50 text-blue-700' },
  resolved: { label: 'Resolved', bg: 'bg-purple-50 text-purple-700' },
  closed: { label: 'Closed', bg: 'bg-neutral-100 text-neutral-600' },
}

const priorityColors: Record<string, string> = {
  low: 'text-neutral-500',
  medium: 'text-amber-600',
  high: 'text-red-600',
}

export default function ManageTickets() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: () => api.get<{ tickets: Ticket[] }>('/tickets/all').then(r => r.data.tickets),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/tickets/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => api.post(`/tickets/${id}/reply`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setReplyText('')
      setExpanded(null)
    },
  })

  const filtered = tickets?.filter(t =>
    !search || t.subject.toLowerCase().includes(search.toLowerCase()) || (t.user as any)?.name?.toLowerCase().includes(search.toLowerCase())
  ) || []

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Support Tickets</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Manage and respond to support tickets.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input id="search_tickets" name="search_tickets"           placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-56 pl-8 text-[13px]"
        />
      </div>

      {!filtered.length ? (
        <EmptyState icon={MessageSquare} title="No tickets found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const status = statusConfig[ticket.status]
            return (
              <div key={ticket._id} className="rounded-xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-neutral-900">{ticket.subject}</h3>
                      <span className={cn('text-[11px] font-medium', priorityColors[ticket.priority])}>{ticket.priority}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[12px] text-neutral-500">
                      <span className="font-medium text-neutral-700">{(ticket.user as any)?.name || 'Unknown'}</span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', status.bg)}>{status.label}</span>
                      <span>{ticket.replies?.length || 0} replies</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => statusMutation.mutate({ id: ticket._id, status: e.target.value })}
                      className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}
                      className="text-[12px] font-medium text-blue-500 hover:text-blue-600"
                    >
                      {expanded === ticket._id ? 'Hide' : 'Reply'}
                    </button>
                  </div>
                </div>

                {expanded === ticket._id && (
                  <div className="border-t border-neutral-100 px-5 py-4">
                    <div className="mb-3 max-h-40 overflow-y-auto space-y-2">
                      {[
                        { user: ticket.user, message: ticket.message, createdAt: ticket.createdAt },
                        ...ticket.replies,
                      ].map((msg, i) => (
                        <div key={i} className="rounded-lg bg-neutral-50 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-medium text-neutral-700">{(msg.user as any)?.name || 'User'}</span>
                            <span className="text-[10px] text-neutral-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[12px] text-neutral-600">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); replyMutation.mutate({ id: ticket._id, message: replyText }) }}>
                      <textarea id="type_reply" name="type_reply"                         rows={2}
                        placeholder="Type reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-[13px] outline-none focus:border-neutral-400"
                        required
                      />
                      <Button type="submit" disabled={replyMutation.isPending} className="h-9 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
                        <Send className="h-3.5 w-3.5" /> Send
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
