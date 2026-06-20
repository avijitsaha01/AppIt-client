import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth.store'
import type { Service, Partner, Slider, Review } from '@/types'
import { ArrowRight, Star, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function NavBar() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <header className={cn(
      'fixed top-0 z-50 w-full transition-all duration-300',
      scrolled ? 'bg-white/90 shadow-sm backdrop-blur-xl' : 'bg-transparent',
    )}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-base font-bold text-white shadow-lg">
            A
          </div>
          <span className={cn('text-xl font-bold', scrolled ? 'text-neutral-900' : 'text-white')}>
            App<span className="text-blue-400">It</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/80 hover:text-white')}>
            Services
          </a>
          <a href="#partners" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/80 hover:text-white')}>
            Partners
          </a>
          <a href="#reviews" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/80 hover:text-white')}>
            Reviews
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button
              variant={scrolled ? 'default' : 'secondary'}
              size="sm"
              className="gap-2"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard <ArrowRight className="h-3 w-3" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}
                className={scrolled ? 'text-neutral-600' : 'text-white hover:bg-white/10'}>
                Login
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={cn('md:hidden', scrolled ? 'text-neutral-900' : 'text-white')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 pb-6 pt-4 md:hidden">
          <div className="space-y-3">
            <a href="#services" className="block text-sm font-medium text-neutral-600" onClick={() => setOpen(false)}>Services</a>
            <a href="#partners" className="block text-sm font-medium text-neutral-600" onClick={() => setOpen(false)}>Partners</a>
            <a href="#reviews" className="block text-sm font-medium text-neutral-600" onClick={() => setOpen(false)}>Reviews</a>
            <div className="pt-2">
              {user ? (
                <Button className="w-full" onClick={() => { setOpen(false); navigate('/dashboard') }}>Dashboard</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); navigate('/login') }}>Login</Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => { setOpen(false); navigate('/register') }}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function HeroSection() {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur">
          <span className="flex h-2 w-2 rounded-full bg-green-400" />
          Now accepting new projects
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl md:leading-tight">
          Your Vision,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Code
          </span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-neutral-400 md:text-xl">
          We build modern digital solutions that transform businesses. From web apps to mobile experiences, we bring ideas to life.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-14 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-base shadow-xl hover:from-blue-700 hover:to-purple-700"
            onClick={() => navigate('/register')}
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 border-white/20 px-8 text-base text-white hover:bg-white/10"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Services
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '50+', label: 'Projects Done' },
            { value: '30+', label: 'Happy Clients' },
            { value: '5+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get<{ services: Service[] }>('/services').then(r => r.data.services),
  })
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section id="services" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            What We Offer
          </div>
          <h2 className="text-4xl font-bold text-neutral-900">Our Services</h2>
          <p className="mt-4 text-lg text-neutral-500">
            Comprehensive IT solutions tailored to your business needs
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((service) => (
              <div
                key={service._id}
                className="group cursor-pointer rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                onMouseEnter={() => setHoveredId(service._id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (!user) { navigate('/login'); return }
                  navigate('/dashboard/order', { state: { service } })
                }}
              >
                <div className={cn(
                  'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300',
                  hoveredId === service._id ? 'from-blue-600 to-purple-600 shadow-lg' : 'from-blue-50 to-purple-50',
                )}>
                  <span className={cn(
                    'text-lg font-bold transition-colors',
                    hoveredId === service._id ? 'text-white' : 'text-blue-600',
                  )}>
                    {service.title.charAt(0)}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">{service.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{service.description}</p>
                <div className={cn(
                  'mt-4 flex items-center gap-1 text-sm font-medium transition-colors',
                  hoveredId === service._id ? 'text-blue-600' : 'text-neutral-400',
                )}>
                  Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PartnerSection() {
  const { data } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.get<{ partners: Partner[] }>('/partners').then(r => r.data.partners),
  })

  return (
    <section id="partners" className="border-t bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            Trusted By
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Our Partners</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {data?.map((partner) => (
            <div
              key={partner._id}
              className="flex h-16 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 object-contain opacity-50 transition-all hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SliderSection() {
  const { data } = useQuery({
    queryKey: ['sliders'],
    queryFn: () => api.get<{ sliders: Slider[] }>('/sliders').then(r => r.data.sliders),
  })
  const [current, setCurrent] = useState(0)
  const slides = data || []

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
          <div className="relative aspect-[21/9]">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700',
                  i === current ? 'opacity-100' : 'opacity-0',
                )}
              >
                <img
                  src={slide.image}
                  alt={slide.title || 'Slider'}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
            ))}
            <div className="absolute bottom-8 left-8 right-8 z-10 md:bottom-12 md:left-12">
              {slides[current]?.title && (
                <h3 className="mb-2 text-2xl font-bold text-white md:text-4xl">{slides[current].title}</h3>
              )}
              {slides[current]?.subtitle && (
                <p className="text-base text-neutral-300 md:text-lg">{slides[current].subtitle}</p>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 right-8 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60',
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent(c => (c === 0 ? slides.length - 1 : c - 1))}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrent(c => (c === slides.length - 1 ? 0 : c + 1))}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ReviewSection() {
  const { data } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.get<{ reviews: Review[] }>('/reviews').then(r => r.data.reviews),
  })

  return (
    <section id="reviews" className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            Testimonials
          </div>
          <h2 className="text-4xl font-bold text-neutral-900">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-neutral-500">
            Hear from the businesses we&apos;ve helped transform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((review, i) => (
            <div
              key={review._id}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating || 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-neutral-600">
                &ldquo;{review.description}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {review.image ? (
                  <img src={review.image} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs text-white">
                      {review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                  {review.designation && (
                    <p className="text-xs text-neutral-500">{review.designation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="border-t bg-neutral-900 py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                A
              </div>
              <span className="text-lg font-bold text-white">App<span className="text-blue-400">It</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              We build modern digital solutions that transform businesses. From web apps to mobile experiences.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#services" className="transition-colors hover:text-white">Web Development</a></li>
              <li><a href="#services" className="transition-colors hover:text-white">Mobile Apps</a></li>
              <li><a href="#services" className="transition-colors hover:text-white">UI/UX Design</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#services" className="transition-colors hover:text-white">About</a></li>
              <li><a href="#partners" className="transition-colors hover:text-white">Partners</a></li>
              <li><a href="#reviews" className="transition-colors hover:text-white">Reviews</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} AppIt. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ServicesSection />
      <PartnerSection />
      <SliderSection />
      <ReviewSection />
      <FooterSection />
    </>
  )
}
