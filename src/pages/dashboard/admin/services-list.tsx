import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Order } from '@/types'

const statusVariant: Record<string, 'pending' | 'ongoing' | 'done'> = {
  pending: 'pending',
  'on-going': 'ongoing',
  done: 'done',
}

function StatusCell({ order }: { order: Order }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/orders/${order._id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusVariant[order.status] || 'default'}>
        {order.status}
      </Badge>
      <Select
        value={order.status}
        onValueChange={(val) => mutation.mutate(val)}
      >
        <SelectTrigger className="h-8 w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="on-going">On Going</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default function ServicesList() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders').then(r => r.data.orders),
  })

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" /></div>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">All Orders</h1>
      {orders?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-neutral-500">No orders yet.</CardContent>
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
                  <h3 className="font-semibold">{(order.service as any)?.title || order.name}</h3>
                  <p className="text-sm text-neutral-600">
                    {order.name} &middot; {order.email}
                  </p>
                  <p className="text-sm text-neutral-500">{order.details.substring(0, 100)}</p>
                  <p className="text-sm font-medium">${order.price}</p>
                </div>
                <StatusCell order={order} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
