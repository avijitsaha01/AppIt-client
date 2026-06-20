import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Order } from '@/types'
import { Search, ClipboardList, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; dot: string; bg: string }> = {
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  'on-going': { label: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  done: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
}

const PAGE_SIZE = 8

export default function ServicesList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders').then(r => r.data.orders),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    return orders.filter(o => {
      const matchSearch = !search ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        ((o.service as any)?.title || '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">All Orders</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Manage and update order statuses.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input id="search_orders" name="search_orders"               placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-8 w-56 pl-8 text-[13px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="h-8 w-32 text-[12px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[12px]">All Status</SelectItem>
              <SelectItem value="pending" className="text-[12px]">Pending</SelectItem>
              <SelectItem value="on-going" className="text-[12px]">In Progress</SelectItem>
              <SelectItem value="done" className="text-[12px]">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-[12px] text-neutral-500">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-neutral-200/70 bg-white py-16 text-neutral-400">
          <ClipboardList className="mb-3 h-10 w-10 stroke-[1.5]" />
          <p className="text-[13px] font-medium text-neutral-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Customer</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Service</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Budget</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((order) => {
                const status = statusConfig[order.status]
                return (
                  <tr key={order._id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-neutral-900">{order.name}</p>
                      <p className="text-[12px] text-neutral-500">{order.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {order.image ? (
                          <img src={order.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100">
                            <Package className="h-4 w-4 text-neutral-500" />
                          </div>
                        )}
                        <span className="text-[13px] text-neutral-700">{(order.service as any)?.title || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900">${order.price.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', status.bg)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                          {status.label}
                        </div>
                        <Select
                          value={order.status}
                          onValueChange={(val) => statusMutation.mutate({ id: order._id, status: val })}
                        >
                          <SelectTrigger className="h-6 w-6 border-0 p-0 shadow-none">
                            <div className="rounded p-0.5 text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                              <ChevronRight className="h-3 w-3 rotate-90" />
                            </div>
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="pending" className="text-[12px]">Pending</SelectItem>
                            <SelectItem value="on-going" className="text-[12px]">In Progress</SelectItem>
                            <SelectItem value="done" className="text-[12px]">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-neutral-500">Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="h-7 w-7 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4))
              const p = start + i
              if (p > totalPages) return null
              return (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={cn('h-7 w-7 p-0 text-[12px]', p === page && 'bg-neutral-900')}
                >
                  {p}
                </Button>
              )
            })}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-7 w-7 p-0">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
