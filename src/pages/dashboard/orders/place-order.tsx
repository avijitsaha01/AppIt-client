import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Service } from '@/types'
import { Send, Upload, X } from 'lucide-react'
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Place an Order</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Fill in the details below to get started.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Service</h2>
            </div>
            <div className="p-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {services?.map((s) => (
                  <button
                    type="button"
                    key={s._id}
                    onClick={() => setServiceId(s._id)}
                    className={cn(
                      'rounded-lg border p-3.5 text-left text-[13px] transition-all',
                      serviceId === s._id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300',
                    )}
                  >
                    <p className="font-medium text-neutral-900">{s.title}</p>
                    <p className="mt-1 text-[12px] text-neutral-500 line-clamp-2">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Contact Information</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-9 text-[13px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 text-[13px]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Company Name</Label>
                <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="h-9 text-[13px]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200/70 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-[14px] font-semibold text-neutral-900">Project Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Description</Label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] shadow-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your project..."
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Budget ($)</Label>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" required className="h-9 text-[13px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-neutral-700">Reference Image</Label>
                  {preview ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => { setFile(null); setPreview(null) }}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3.5 text-[13px] text-neutral-500 transition-colors hover:border-neutral-400">
                      <Upload className="h-3.5 w-3.5" />
                      {file ? file.name : 'Upload'}
                      <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3.5 text-[13px] text-red-600">{error}</div>}

          <Button type="submit" disabled={mutation.isPending}
            className="h-10 w-full gap-2 bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
            <Send className="h-4 w-4" />
            {mutation.isPending ? 'Submitting...' : 'Submit Order'}
          </Button>
        </form>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border border-neutral-200/70 bg-white">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h2 className="text-[14px] font-semibold text-neutral-900">Summary</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[12px] text-neutral-500">Service</p>
                  <p className="text-[13px] font-medium text-neutral-900">{selectedService?.title || '—'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-neutral-500">Budget</p>
                  <p className="text-[13px] font-medium text-neutral-900">{price ? `$${parseInt(price).toLocaleString()}` : '—'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-neutral-500">Timeline</p>
                  <p className="text-[13px] font-medium text-neutral-900">To be discussed</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200/70 bg-neutral-50 p-5">
              <h3 className="text-[13px] font-semibold text-neutral-900">Need help?</h3>
              <p className="mt-1 text-[12px] text-neutral-500">Contact our support team for assistance.</p>
              <button className="mt-3 text-[12px] font-medium text-neutral-900 underline underline-offset-2">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
