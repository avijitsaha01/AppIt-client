import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { Order } from '@/types'
import { cn } from '@/lib/utils'
import {
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  MessageSquare,
  Circle,
  List,
} from 'lucide-react'

const statusConfig = {
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  'on-going': { label: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  done: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
}

function MetricCard({ icon: Icon, label, value, sub }: {
  icon: any; label: string; value: number; sub?: string
}) {
  return (
    <div className="rounded-xl border border-neutral-200/70 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
          <Icon className="h-5 w-5 text-neutral-600" />
        </div>
        {sub && <span className="text-[12px] font-medium text-emerald-600">{sub}</span>}
      </div>
      <p className="mt-4 text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-0.5 text-[13px] text-neutral-500">{label}</p>
    </div>
  )
}

export default function DashboardOverview() {
  const { isAdmin} = useAuthStore()
  const navigate = useNavigate()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', isAdmin() ? 'all' : 'my'],
    queryFn: () => api.get(isAdmin() ? '/orders' : '/orders/my').then(r => r.data.orders as Order[]),
  })

  const total = orders?.length || 0
  const ongoing = orders?.filter(o => o.status === 'on-going').length || 0
  const completed = orders?.filter(o => o.status === 'done').length || 0
  const pending = orders?.filter(o => o.status === 'pending').length || 0
  const recentOrders = orders?.slice(0, 5) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Overview</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Welcome back{isAdmin() ? ', Admin' : ''}. Here&apos;s what&apos;s happening.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Package} label="Total Orders" value={total} />
        <MetricCard icon={Clock} label="In Progress" value={ongoing} sub={ongoing > 0 ? 'Active' : undefined} />
        <MetricCard icon={CheckCircle2} label="Completed" value={completed} />
        <MetricCard icon={Circle} label="Pending" value={pending} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Recent Orders</h2>
              <button
                onClick={() => navigate(isAdmin() ? '/dashboard/servicesList' : '/dashboard/service-list')}
                className="text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                View all
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-neutral-400">
                <Package className="mb-3 h-10 w-10 stroke-[1.5]" />
                <p className="text-[13px] font-medium text-neutral-500">No orders yet</p>
                <p className="mt-0.5 text-[12px] text-neutral-400">Place your first order to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentOrders.map((order) => {
                  const status = statusConfig[order.status]
                  return (
                    <div key={order._id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50">
                      {order.image ? (
                        <img src={order.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                          <Package className="h-4 w-4 text-neutral-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-neutral-900">
                          {(order.service as any)?.title || order.name}
                        </p>
                        <p className="text-[12px] text-neutral-500">
                          {order.name} &middot; ${order.price.toLocaleString()}
                        </p>
                      </div>
                      <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', status.bg)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                { icon: ShoppingCart, label: 'Place New Order', onClick: () => navigate('/dashboard/order') },
                { icon: MessageSquare, label: 'Write a Review', onClick: () => navigate('/dashboard/create-review') },
                ...(isAdmin() ? [
                  { icon: Package, label: 'Add New Service', onClick: () => navigate('/dashboard/serviceAdd') },
                  { icon: List, label: 'View All Orders', onClick: () => navigate('/dashboard/servicesList') },
                ] : []),
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  <action.icon className="h-4 w-4 text-neutral-400" />
                  <span className="flex-1 text-left">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Status Overview</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Pending', value: pending, color: 'bg-amber-500' },
                { label: 'In Progress', value: ongoing, color: 'bg-blue-500' },
                { label: 'Completed', value: completed, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className="text-neutral-500">{item.label}</span>
                    <span className="font-medium text-neutral-700">{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100">
                    <div
                      className={cn('h-1.5 rounded-full transition-all', item.color)}
                      style={{ width: total ? `${(item.value / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
