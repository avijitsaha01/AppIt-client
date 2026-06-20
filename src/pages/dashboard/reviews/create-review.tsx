import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CreateReview() {
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(5)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/reviews', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setName(''); setDesignation(''); setDescription(''); setFile(null); setPreview(null); setRating(5)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to create review'),
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
    formData.append('name', name)
    formData.append('description', description)
    formData.append('rating', rating.toString())
    if (designation) formData.append('designation', designation)
    if (file) formData.append('image', file)
    mutation.mutate(formData)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Create Review</h1>
        <p className="mt-1 text-neutral-500">Share your experience with our services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600">
                Review submitted successfully!
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation (optional)</Label>
                <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. CEO, Company" className="h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={cn(
                      'rounded-lg p-2 transition-all',
                      n <= rating ? 'text-yellow-400' : 'text-neutral-200 hover:text-yellow-300',
                    )}
                  >
                    <Star className={cn('h-8 w-8', n <= rating && 'fill-yellow-400')} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Your Review</Label>
              <textarea
                id="desc"
                rows={4}
                className="flex w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Photo (optional)</Label>
              {preview ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null) }}
                    className="absolute right-0 top-0 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-neutral-300 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                  <Upload className="mb-1 h-5 w-5 text-neutral-400" />
                  <span className="text-[10px] text-neutral-400">Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:from-blue-700 hover:to-purple-700"
              disabled={mutation.isPending}
            >
              <Star className="h-5 w-5" />
              {mutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
