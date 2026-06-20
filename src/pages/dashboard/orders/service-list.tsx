import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order } from '@/types'

const statusVariant: Record<string, 'pending' | 'ongoing' | 'done'> = {
  pending: 'pending',
  'on-going': 'ongoing',
  done: 'done',
}

export default function ServiceList() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders/my').then(r => r.data.orders),
  })

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" /></div>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {orders?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-neutral-500">
            No orders yet. Place your first order!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order._id}>
              <CardContent className="flex items-center gap-4 p-4">
                {order.image && (
                  <img src={order.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {(order.service as any)?.title || order.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{order.details.substring(0, 100)}...</p>
                  <p className="text-sm font-medium">${order.price}</p>
                </div>
                <Badge variant={statusVariant[order.status] || 'default'}>
                  {order.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
