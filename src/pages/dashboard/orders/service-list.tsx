import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types'
import { Package, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusVariant: Record<string, 'pending' | 'ongoing' | 'done'> = {
  pending: 'pending',
  'on-going': 'ongoing',
  done: 'done',
}

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'on-going', label: 'In Progress' },
  { key: 'done', label: 'Completed' },
]

export default function ServiceList() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders/my').then(r => r.data.orders),
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    return orders.filter(o => {
      const matchSearch = !search || 
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        ((o.service as any)?.title || '').toLowerCase().includes(search.toLowerCase()) ||
        o.details.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'all' || o.status === activeTab
      return matchSearch && matchTab
    })
  }, [orders, search, activeTab])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
        <p className="mt-1 text-neutral-500">Track and manage your service orders.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all',
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-neutral-400">
            <Package className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium text-neutral-500">No orders found</p>
            <p className="mt-1 text-sm">{orders?.length ? 'Try a different search.' : 'Place your first order to get started.'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Budget</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((order) => (
                <tr key={order._id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {order.image && (
                        <img src={order.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-neutral-900">
                        {(order.service as any)?.title || order.name}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-xs px-6 py-4">
                    <p className="truncate text-sm text-neutral-600">{order.details}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-neutral-900">${order.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[order.status] || 'default'}>
                      {order.status === 'on-going' ? 'In Progress' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
