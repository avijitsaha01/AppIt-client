import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import api from '@/lib/api'
import type { AuthResponse } from '@/types'
import { UserPlus } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur">
            A
          </div>
          <span className="text-xl font-bold text-white">AppIt</span>
        </Link>
        <div>
          <blockquote className="text-2xl font-semibold text-white/90">
            &ldquo;The team was professional, responsive, and delivered beyond our expectations.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-white/60">Jane Smith, Product Manager at CloudNine</p>
        </div>
        <div className="text-sm text-white/40">&copy; 2024 AppIt. All rights reserved.</div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4">
        <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
          <CardHeader className="text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                A
              </div>
              <span className="text-lg font-bold">App<span className="text-blue-600">It</span></span>
            </Link>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Get started with AppIt today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-100">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
