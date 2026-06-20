import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Service } from '@/types'
import { Send, Upload, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [preview, setPreview] = useState<string | null>(null)
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
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to place order'),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

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

  const selectedService = services?.find(s => s._id === serviceId)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Place an Order</h1>
        <p className="mt-1 text-neutral-500">Fill in the details below to get started with your project.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {services?.map((s) => (
                  <button
                    type="button"
                    key={s._id}
                    onClick={() => setServiceId(s._id)}
                    className={cn(
                      'relative rounded-xl border-2 p-4 text-left transition-all',
                      serviceId === s._id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
                    )}
                  >
                    {serviceId === s._id && (
                      <div className="absolute right-2 top-2 rounded-full bg-blue-600 p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-neutral-900">{s.title}</p>
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{s.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="h-10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="details">Description</Label>
                <textarea
                  id="details"
                  rows={5}
                  className="flex w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your project in detail..."
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Budget ($)</Label>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Reference Image</Label>
                  <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 text-sm text-neutral-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                    <Upload className="h-4 w-4" />
                    {file ? file.name : 'Upload image'}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
              {preview && (
                <img src={preview} alt="Preview" className="h-32 w-48 rounded-xl object-cover" />
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
          )}

          <Button
            type="submit"
            className="h-12 w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-base shadow-md hover:from-blue-700 hover:to-purple-700"
            disabled={mutation.isPending}
          >
            <Send className="h-5 w-5" />
            {mutation.isPending ? 'Submitting...' : 'Submit Order'}
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Service</p>
                  <p className="font-medium text-neutral-900">
                    {selectedService?.title || 'Not selected'}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Budget</p>
                  <p className="font-medium text-neutral-900">
                    {price ? `$${parseInt(price).toLocaleString()}` : '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Timeline</p>
                  <p className="font-medium text-neutral-900">To be discussed</p>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
              <h3 className="text-lg font-semibold">Need help?</h3>
              <p className="mt-2 text-sm text-white/80">
                Our team is here to assist you with any questions about your order.
              </p>
              <Button variant="secondary" className="mt-4 bg-white text-blue-700 hover:bg-white/90">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
