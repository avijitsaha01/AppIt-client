import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Ticket } from '@/types'
import { cn } from '@/lib/utils'
import { MessageSquare, Plus, Send, X, ArrowRight } from 'lucide-react'

const statusConfig: Record<string, { label: string; dot: string; bg: string }> = {
  open: { label: 'Open', dot: 'bg-green-500', bg: 'bg-green-50 text-green-700' },
  'in-progress': { label: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  resolved: { label: 'Resolved', dot: 'bg-purple-500', bg: 'bg-purple-50 text-purple-700' },
  closed: { label: 'Closed', dot: 'bg-neutral-500', bg: 'bg-neutral-100 text-neutral-600' },
}

const priorityConfig: Record<string, string> = {
  low: 'text-neutral-500',
  medium: 'text-amber-600',
  high: 'text-red-600',
}

export default function Tickets() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.get<{ tickets: Ticket[] }>('/tickets').then(r => r.data.tickets),
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/tickets', { subject, message, priority }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setShowCreate(false)
      setSubject('')
      setMessage('')
      setPriority('medium')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Support Tickets</h1>
          <p className="mt-1 text-[13px] text-neutral-500">Create and track support requests.</p>
        </div>
        <Button className="h-8 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" /> New Ticket
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !tickets?.length ? (
        <EmptyState icon={MessageSquare} title="No tickets yet" description="Create a ticket to get support." />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status]
            return (
              <div
                key={ticket._id}
                className="cursor-pointer rounded-xl border border-neutral-200/70 bg-white p-5 transition-all hover:shadow-sm"
                onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-neutral-900">{ticket.subject}</h3>
                      <span className={cn('text-[11px] font-medium', priorityConfig[ticket.priority])}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-neutral-500 line-clamp-1">{ticket.message}</p>
                    <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-400">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium', status.bg)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </span>
                      <span>{ticket.replies?.length || 0} replies</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-300" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Create Ticket</h3>
              <button onClick={() => setShowCreate(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }}>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 text-[13px]"
                required
              />
              <div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] outline-none focus:border-neutral-400"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <textarea
                rows={5}
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-400"
                required
              />
              <Button type="submit" disabled={createMutation.isPending} className="h-10 w-full gap-2 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
                <Send className="h-4 w-4" />
                {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
