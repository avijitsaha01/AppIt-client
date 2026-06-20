import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

export default function CreateReview() {
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(5)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/reviews', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setName(''); setDesignation(''); setDescription(''); setFile(null); setRating(5)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to create review'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('rating', rating.toString())
    if (designation) formData.append('designation', designation)
    if (file) formData.append('image', file)
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create Review</h1>
      <Card>
        <CardHeader><CardTitle>Share Your Experience</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Review</Label>
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
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)}>
                      <Star className={`h-6 w-6 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Image (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              <Star className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
