import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { User } from '@/types'
import { Search, Crown, UserMinus, UserPlus, Shield } from 'lucide-react'
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
        <h1 className="text-xl font-semibold text-neutral-900">Manage Admins</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Promote or demote admin users.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200/70 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <h2 className="text-[14px] font-semibold text-neutral-900">Add Admin</h2>
            </div>
          </div>
          <div className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-red-50 p-3 text-[12px] text-red-600">{error}</div>}
              {success && <div className="rounded-lg bg-emerald-50 p-3 text-[12px] text-emerald-600">{success}</div>}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-neutral-700">User Email</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="h-9 flex-1 text-[13px]"
                  />
                  <Button type="submit" disabled={makeAdminMutation.isPending}
                    className="h-9 gap-1.5 bg-neutral-900 text-[12px] text-white hover:bg-neutral-800">
                    <Shield className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/70 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-neutral-900">All Users</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input id="search_users" name="search_users"                 placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full pl-8 text-[13px]"
              />
            </div>
            <div className="max-h-[320px] space-y-1 overflow-y-auto">
              {filtered?.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-neutral-400">No users found</p>
              ) : (
                filtered?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-neutral-900">{user.name}</p>
                      <p className="truncate text-[12px] text-neutral-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'rounded px-2 py-0.5 text-[11px] font-medium',
                        user.role === 'admin' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600',
                      )}>
                        {user.role}
                      </span>
                      {user.role === 'admin' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAdminMutation.mutate(user.email)}
                          className="h-7 gap-1 border-red-200 text-[11px] text-red-600 hover:bg-red-50"
                        >
                          <UserMinus className="h-3 w-3" />
                          Demote
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => makeAdminMutation.mutate(user.email)}
                          className="h-7 gap-1 border-blue-200 text-[11px] text-blue-600 hover:bg-blue-50"
                        >
                          <UserPlus className="h-3 w-3" />
                          Promote
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
