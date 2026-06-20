import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function ServiceAdd() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/services', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setTitle(''); setDescription(''); setIcon(''); setFile(null)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to add service'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (icon) formData.append('icon', icon)
    if (file) formData.append('image', file)
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Service</h1>
      <Card>
        <CardHeader><CardTitle>Service Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea
                id="desc"
                className="flex min-h-[100px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon URL (optional)</Label>
                <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Image (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Adding...' : 'Add Service'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
