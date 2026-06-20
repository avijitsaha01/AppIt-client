import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types'
import { Package, Search, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  'on-going': { label: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  done: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
}

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'on-going', label: 'In Progress' },
  { key: 'done', label: 'Completed' },
]

const timelineSteps = [
  { key: 'pending', label: 'Order Placed', desc: 'Your order has been submitted and is awaiting review.' },
  { key: 'on-going', label: 'In Progress', desc: 'We are actively working on your project.' },
  { key: 'done', label: 'Completed', desc: 'Your project has been completed and delivered.' },
]

export default function ServiceList() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders/my').then(r => r.data.orders),
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    return orders.filter(o => {
      const matchSearch = !search || 
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        ((o.service as any)?.title || '').toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'all' || o.status === activeTab
      return matchSearch && matchTab
    })
  }, [orders, search, activeTab])

  const statusOrder = { pending: 0, 'on-going': 1, done: 2 }
  const currentStepIndex = selectedOrder ? statusOrder[selectedOrder.status] : -1

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
        <h1 className="text-xl font-semibold text-neutral-900">My Orders</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Track and manage your service orders.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-0.5 rounded-lg bg-neutral-100 p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-md px-3.5 py-1.5 text-[12px] font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input id="search_orders" name="search_orders"             placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-56 pl-8 text-[13px]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-neutral-200/70 bg-white py-16 text-neutral-400">
          <Package className="mb-3 h-10 w-10 stroke-[1.5]" />
          <p className="text-[13px] font-medium text-neutral-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Service</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Details</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Budget</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((order) => {
                const status = statusConfig[order.status]
                return (
                  <tr key={order._id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {order.image ? (
                          <img src={order.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100">
                            <Package className="h-4 w-4 text-neutral-500" />
                          </div>
                        )}
                        <span className="text-[13px] font-medium text-neutral-900">
                          {(order.service as any)?.title || order.name}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[200px] px-5 py-3.5">
                      <p className="truncate text-[13px] text-neutral-600">{order.details}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-neutral-900">${order.price.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', status.bg)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        Progress
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {(selectedOrder.service as any)?.title || selectedOrder.name}
                </h3>
                <p className="text-[13px] text-neutral-500">${selectedOrder.price.toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              {timelineSteps.map((step, i) => {
                const isCompleted = i < currentStepIndex
                const isCurrent = i === currentStepIndex
                const isPending = i > currentStepIndex
                return (
                  <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                        isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' :
                        isCurrent ? 'border-blue-500 bg-blue-500 text-white' :
                        'border-neutral-200 bg-white text-neutral-400',
                      )}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={cn(
                          'mt-1 w-0.5 flex-1',
                          isCompleted ? 'bg-emerald-200' : 'bg-neutral-100',
                        )} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={cn(
                        'text-sm font-medium',
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-neutral-900' : 'text-neutral-400',
                      )}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[12px] text-neutral-400">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
