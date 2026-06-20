import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function MakeAdmin() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (email: string) => api.post('/admin/make-admin', { email }),
    onSuccess: () => {
      setSuccess(`Admin added: ${email}`)
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to add admin'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    mutation.mutate(email)
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Manage Admins</h1>
      <Card>
        <CardHeader><CardTitle>Add Admin</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              <Shield className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Adding...' : 'Make Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
