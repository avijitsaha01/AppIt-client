import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { LogOut, LayoutDashboard } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          App<span className="text-blue-600">It</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <span className="text-sm text-neutral-600">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/') }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
