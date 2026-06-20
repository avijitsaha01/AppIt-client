import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'
import { ShoppingCart, ClipboardList, Star, Users } from 'lucide-react'

export default function DashboardOverview() {
  const { isAdmin } = useAuthStore()
  const { data: orders } = useQuery({
    queryKey: ['orders', isAdmin() ? 'all' : 'my'],
    queryFn: () =>
      api.get(isAdmin() ? '/orders' : '/orders/my').then(r => r.data.orders),
  })

  const stats = [
    { label: 'Total Orders', value: orders?.length || 0, icon: ClipboardList, color: 'bg-blue-50 text-blue-600' },
    { label: isAdmin() ? 'Customers' : 'Active', value: orders?.filter((o: any) => o.status !== 'done').length || 0, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Completed', value: orders?.filter((o: any) => o.status === 'done').length || 0, icon: Star, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">{stat.label}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
