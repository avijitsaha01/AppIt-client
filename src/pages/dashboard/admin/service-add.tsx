import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Upload, X } from 'lucide-react'

export default function ServiceAdd() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/services', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setTitle(''); setDescription(''); setIcon(''); setFile(null); setPreview(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to add service'),
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
    setSuccess(false)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (icon) formData.append('icon', icon)
    if (file) formData.append('image', file)
    mutation.mutate(formData)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Add New Service</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Create a new service offering.</p>
      </div>

      <div className="rounded-xl border border-neutral-200/70 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">Service Details</h2>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-lg bg-red-50 p-3.5 text-[13px] text-red-600">{error}</div>}
            {success && <div className="rounded-lg bg-emerald-50 p-3.5 text-[13px] text-emerald-600">Service added!</div>}

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-neutral-700">Service Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Web Development" required className="h-9 text-[13px]" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-neutral-700">Description</Label>
              <textarea
                rows={4}
                className="flex w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the service..."
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Icon (optional)</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Code, Palette" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">Image</Label>
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
                    Upload image
                    <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" disabled={mutation.isPending}
              className="h-9 gap-2 bg-neutral-900 text-[13px] text-white hover:bg-neutral-800">
              <Plus className="h-4 w-4" />
              {mutation.isPending ? 'Adding...' : 'Add Service'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
