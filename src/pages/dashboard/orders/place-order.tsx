import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Service } from '@/types'
import { Send } from 'lucide-react'

export default function PlaceOrder() {
  const location = useLocation()
  const preselectedService = (location.state as any)?.service

  const [serviceId, setServiceId] = useState(preselectedService?._id || '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [details, setDetails] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get<{ services: Service[] }>('/services').then(r => r.data.services),
  })

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/orders', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate('/dashboard/service-list')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to place order')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('serviceId', serviceId)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('companyName', companyName)
    formData.append('details', details)
    formData.append('price', price)
    if (file) formData.append('image', file)

    mutation.mutate(formData)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Place an Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Project Details</Label>
              <textarea
                id="details"
                className="flex min-h-[100px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Image (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              <Send className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Submitting...' : 'Place Order'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
