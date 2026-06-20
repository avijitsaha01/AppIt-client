import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import type { Order } from '@/types'
import {
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShoppingCart,
  MessageSquare,
} from 'lucide-react'

const statusVariant: Record<string, 'pending' | 'ongoing' | 'done'> = {
  pending: 'pending',
  'on-going': 'ongoing',
  done: 'done',
}

function StatCard({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: number; trend?: string; color: string
}) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${color}`} />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <p className="mt-4 text-3xl font-bold text-neutral-900">{value}</p>
        <p className="mt-1 text-sm text-neutral-500">{label}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({ icon: Icon, label, onClick, color }: {
  icon: any; label: string; onClick: () => void; color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md ${color} group cursor-pointer`}
    >
      <div className={`rounded-lg p-2 ${color} bg-opacity-20`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 text-sm font-medium text-neutral-700">{label}</span>
      <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
    </button>
  )
}

export default function DashboardOverview() {
  const { isAdmin } = useAuthStore()
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back{isAdmin() ? ', Admin' : ''} 👋
        </h1>
        <p className="mt-1 text-neutral-500">Here&apos;s what&apos;s happening with your projects today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={total} color="bg-blue-600" />
        <StatCard icon={Clock} label="In Progress" value={ongoing} trend="Active" color="bg-amber-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} color="bg-green-500" />
        <StatCard icon={TrendingUp} label="Pending" value={pending} color="bg-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-blue-600"
                onClick={() => navigate(isAdmin() ? '/dashboard/servicesList' : '/dashboard/service-list')}
              >
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <Package className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-neutral-50"
                    >
                      {order.image && (
                        <img src={order.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {(order.service as any)?.title || order.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {order.name} &middot; ${order.price}
                        </p>
                      </div>
                      <Badge variant={statusVariant[order.status] || 'default'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction
                icon={ShoppingCart}
                label="Place New Order"
                color="bg-blue-100 text-blue-600"
                onClick={() => navigate('/dashboard/order')}
              />
              <QuickAction
                icon={MessageSquare}
                label="Write a Review"
                color="bg-amber-100 text-amber-600"
                onClick={() => navigate('/dashboard/create-review')}
              />
              {isAdmin() && (
                <>
                  <QuickAction
                    icon={Package}
                    label="Add New Service"
                    color="bg-purple-100 text-purple-600"
                    onClick={() => navigate('/dashboard/serviceAdd')}
                  />
                  <QuickAction
                    icon={TrendingUp}
                    label="All Orders (Admin)"
                    color="bg-green-100 text-green-600"
                    onClick={() => navigate('/dashboard/servicesList')}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-neutral-600">Pending</span>
                    <span className="font-medium text-neutral-900">{pending}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all"
                      style={{ width: total ? `${(pending / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-neutral-600">In Progress</span>
                    <span className="font-medium text-neutral-900">{ongoing}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-amber-500 transition-all"
                      style={{ width: total ? `${(ongoing / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-neutral-600">Completed</span>
                    <span className="font-medium text-neutral-900">{completed}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: total ? `${(completed / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
