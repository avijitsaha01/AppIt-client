import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/types'
import { Shield, UserCog, Search, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MakeAdmin() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<{ users: User[] }>('/admin/users').then(r => r.data.users),
  })

  const makeAdminMutation = useMutation({
    mutationFn: (email: string) => api.post('/admin/make-admin', { email }),
    onSuccess: () => {
      setSuccess(`Admin added: ${email}`)
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed'),
  })

  const removeAdminMutation = useMutation({
    mutationFn: (email: string) => api.post('/admin/remove-admin', { email }),
    onSuccess: () => {
      setSuccess(`Admin removed: ${email}`)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed'),
  })

  const filtered = usersData?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    makeAdminMutation.mutate(email)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Manage Admins</h1>
        <p className="mt-1 text-neutral-500">Promote users to admin or demote them.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-amber-500" />
              Add Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
              )}
              {success && (
                <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600">{success}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={makeAdminMutation.isPending}
              >
                <Shield className="h-4 w-4" />
                {makeAdminMutation.isPending ? 'Adding...' : 'Make Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filtered?.length === 0 ? (
                <p className="py-8 text-center text-sm text-neutral-400">No users found</p>
              ) : (
                filtered?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-neutral-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">{user.name}</p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {user.role === 'admin' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => removeAdminMutation.mutate(user.email)}
                        >
                          Demote
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => makeAdminMutation.mutate(user.email)}
                        >
                          Promote
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
