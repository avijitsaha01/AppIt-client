import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/products', label: 'Products' },
  { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

function NavBar() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const isHome = location.pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled || !isHome ? 'bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white">
            A
          </div>
          <span className={cn('text-lg font-bold tracking-tight', scrolled || !isHome ? 'text-neutral-900' : 'text-white')}>
            App<span className="text-blue-500">It</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-sm font-medium transition-colors',
                location.pathname === link.to
                  ? scrolled || !isHome ? 'text-blue-500' : 'text-white'
                  : scrolled || !isHome ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/70 hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Button
              className={cn(
                'h-10 rounded-full px-6 text-sm font-medium',
                scrolled || !isHome
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-white text-neutral-900 hover:bg-white/90',
              )}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={cn(
                  'text-sm font-medium transition-colors',
                  scrolled || !isHome ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/70 hover:text-white',
                )}
              >
                Login
              </button>
              <Button
                className={cn(
                  'h-10 rounded-full px-6 text-sm font-medium',
                  scrolled || !isHome
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-white text-neutral-900 hover:bg-white/90',
                )}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={cn('md:hidden', scrolled || !isHome ? 'text-neutral-900' : 'text-white')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-5 pb-8 pt-5 md:hidden">
          <nav className="mb-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium',
                  location.pathname === link.to ? 'text-blue-500' : 'text-neutral-700',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            {user ? (
              <Button className="flex-1 rounded-full" onClick={() => { setOpen(false); navigate('/dashboard') }}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setOpen(false); navigate('/login') }}>
                  Login
                </Button>
                <Button className="flex-1 rounded-full bg-neutral-900" onClick={() => { setOpen(false); navigate('/register') }}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function FooterSection() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white">
                A
              </div>
              <span className="text-lg font-bold text-neutral-900">
                App<span className="text-blue-500">It</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              We build modern digital solutions that transform businesses. From web apps to mobile experiences, we bring ideas to life.
            </p>
          </div>
          <div>
            <h4 className="mb-5 text-sm font-semibold text-neutral-900">Pages</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-neutral-900">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm font-semibold text-neutral-900">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>hello@appit.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-100 pt-8 text-center text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} AppIt. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export function PublicLayout() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <FooterSection />
    </>
  )
}
