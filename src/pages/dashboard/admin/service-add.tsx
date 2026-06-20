import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <h1 className="text-2xl font-bold text-neutral-900">Add New Service</h1>
        <p className="mt-1 text-neutral-500">Create a new service offering for your customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600">
                Service added successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Web Development"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea
                id="desc"
                rows={5}
                className="flex w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the service in detail..."
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name (optional)</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. Code, Palette, Cloud"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Service Image</Label>
                {preview ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null) }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                    <Upload className="mb-2 h-6 w-6 text-neutral-400" />
                    <span className="text-sm text-neutral-500">Upload image</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:from-blue-700 hover:to-purple-700"
              disabled={mutation.isPending}
            >
              <Plus className="h-5 w-5" />
              {mutation.isPending ? 'Adding Service...' : 'Add Service'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
