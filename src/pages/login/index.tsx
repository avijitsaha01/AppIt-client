import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import type { AuthResponse } from '@/types'
import { LogIn, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex items-start p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm shadow-lg shadow-black/10">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              App<span className="text-blue-300">It</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 px-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            Trusted by 200+ companies
          </div>
          <blockquote className="text-2xl font-semibold leading-snug text-white/90 md:text-3xl">
            &ldquo;AppIt transformed our business with their incredible web application. The team was professional, responsive, and delivered beyond expectations.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
              KH
            </div>
            <div>
              <p className="text-sm font-medium text-white">Kabir Hossain</p>
              <p className="text-sm text-white/50">CEO, Shikho Technologies</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-12 pb-12">
          <div className="flex items-center gap-6 text-sm text-white/30">
            <span>&copy; {new Date().getFullYear()} AppIt</span>
            <span className="h-4 w-px bg-white/10" />
            <span>All rights reserved</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-lg">
                A
              </div>
              <span className="text-lg font-bold">App<span className="text-blue-600">It</span></span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <span className="text-xs font-bold text-red-500">!</span>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 rounded-xl border-neutral-200 bg-white px-4 text-sm shadow-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border-neutral-200 bg-white px-4 text-sm shadow-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-xs font-medium text-neutral-400 transition-colors hover:text-blue-600"
                onClick={() => {/* password reset */}}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/30"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
