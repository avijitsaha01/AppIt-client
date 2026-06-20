import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Ticket } from '@/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, Send } from 'lucide-react'

const statusConfig: Record<string, { label: string; bg: string }> = {
  open: { label: 'Open', bg: 'bg-green-50 text-green-700' },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50 text-blue-700' },
  resolved: { label: 'Resolved', bg: 'bg-purple-50 text-purple-700' },
  closed: { label: 'Closed', bg: 'bg-neutral-100 text-neutral-600' },
}

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [reply, setReply] = useState('')

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => api.get<{ ticket: Ticket }>(`/tickets/${id}`).then(r => r.data.ticket),
    enabled: !!id,
  })

  const replyMutation = useMutation({
    mutationFn: () => api.post(`/tickets/${id}/reply`, { message: reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setReply('')
    },
  })

  if (isLoading) return <LoadingSkeleton />
  if (!ticket) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-[13px] text-neutral-500">Ticket not found</p>
        <Button className="mt-4 rounded-full" onClick={() => navigate('/dashboard/tickets')}>Go Back</Button>
      </div>
    )
  }

  const status = statusConfig[ticket.status]
  const allMessages = [
    { user: ticket.user, message: ticket.message, createdAt: ticket.createdAt },
    ...ticket.replies,
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate('/dashboard/tickets')} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Tickets
      </button>

      <div className="rounded-xl border border-neutral-200/70 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">{ticket.subject}</h1>
              <div className="mt-1 flex items-center gap-3 text-[12px] text-neutral-400">
                <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', status.bg)}>
                  {status.label}
                </span>
                <span className="capitalize">{ticket.priority} priority</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {allMessages.map((msg, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600">
                  {(msg.user as any)?.name?.[0] || 'U'}
                </div>
                <span className="text-[12px] font-medium text-neutral-700">{(msg.user as any)?.name || 'User'}</span>
                <span className="text-[11px] text-neutral-400">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-neutral-600 ml-9">{msg.message}</p>
            </div>
          ))}
        </div>

        {ticket.status !== 'closed' && (
          <div className="border-t border-neutral-100 px-5 py-4">
            <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); replyMutation.mutate() }}>
              <textarea id="type_your_reply" name="type_your_reply"                 rows={3}
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-400"
                required
              />
              <Button type="submit" disabled={replyMutation.isPending} className="h-9 shrink-0 gap-1.5 rounded-full bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
