import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import type { Service, Partner, Review, Portfolio } from '@/types'
import {
  ArrowRight, Star, ChevronRight, Menu, X, Play, Check, Send,
  Code2, Palette, Cloud, Brain, Shield, Megaphone, Quote,
  ExternalLink, MapPin, Phone, Mail,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#works', label: 'Our Works' },
  { href: '#partners', label: 'Partners' },
  { href: '#reviews', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

const serviceIcons: Record<string, typeof Code2> = {
  Code: Code2, Palette, Cloud: Cloud, Brain: Brain, Shield: Shield, Megaphone,
}

function NavBar() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        scrolled ? 'bg-white/80 shadow-sm backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <span className={cn('text-lg font-bold tracking-tight', scrolled ? 'text-neutral-900' : 'text-white')}>
            App<span className="text-blue-500">It</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors',
                scrolled ? 'text-neutral-500 hover:text-neutral-900' : 'text-white/60 hover:text-white',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Button
              className={cn(
                'h-10 rounded-full px-6 text-sm font-medium shadow-lg transition-all hover:shadow-xl',
                scrolled
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
                  scrolled ? 'text-neutral-500 hover:text-neutral-900' : 'text-white/60 hover:text-white',
                )}
              >
                Sign In
              </button>
              <Button
                className={cn(
                  'h-10 rounded-full px-6 text-sm font-medium shadow-lg transition-all hover:shadow-xl',
                  scrolled
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
          className={cn('md:hidden', scrolled ? 'text-neutral-900' : 'text-white')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-100 bg-white/95 px-6 pb-8 pt-5 backdrop-blur-xl md:hidden">
          <nav className="mb-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-sm font-medium text-neutral-700">
                {link.label}
              </a>
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
                  Sign In
                </Button>
                <Button className="flex-1 rounded-full bg-neutral-900" onClick={() => { setOpen(false); navigate('/register') }}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function HeroSection() {
  const navigate = useNavigate()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.08),transparent_60%)]" />
      <div
        className="pointer-events-none absolute -inset-px opacity-30 transition-all duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.08), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-1.5 text-sm text-white/50 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          We&apos;re hiring — join our team
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          We Build
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Digital Excellence
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-white/30 md:text-lg">
          We craft modern digital solutions that transform businesses. From web apps to mobile experiences — we bring ideas to life with precision and creativity.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            className="group relative h-12 overflow-hidden rounded-full bg-white px-8 text-sm font-medium text-neutral-900 shadow-2xl transition-all hover:shadow-white/20"
            onClick={() => navigate('/register')}
          >
            <span className="relative z-10 flex items-center">
              Start Your Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <button className="group flex items-center gap-3 text-sm font-medium text-white/40 transition-colors hover:text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-white/30">
              <Play className="h-4 w-4 fill-white pl-0.5 text-white" />
            </span>
            Watch Showreel
          </button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-16">
          {[
            { label: 'Projects Delivered', value: '200+' },
            { label: 'Happy Clients', value: '98%' },
            { label: 'Years Experience', value: '7+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-white/20">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
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

  if (isLoading) {
    return (
      <section className="bg-white py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="relative bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            What We Do
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            We provide the best
            <br />
            <span className="text-blue-500">digital services</span>
          </h2>
          <p className="mt-4 max-w-lg text-neutral-400">
            From strategy to execution, we deliver end-to-end solutions that drive real results for your business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((service) => {
            const Icon = (service.icon && serviceIcons[service.icon]) || Code2
            return (
              <div
                key={service._id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl"
                onClick={() => {
                  if (!user) { navigate('/login'); return }
                  navigate('/dashboard/order', { state: { service } })
                }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition-all duration-500 group-hover:scale-[3] group-hover:bg-blue-500/5" />
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative z-10 mb-3 text-lg font-semibold text-neutral-900">{service.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-neutral-400">{service.description}</p>
                <div className="relative z-10 mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-500 opacity-0 transition-all group-hover:opacity-100">
                  Learn More <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 py-28">
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
              About Us
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              Creative agency
              <br />
              focused on <span className="text-blue-500">growth</span>
            </h2>
            <p className="mb-8 leading-relaxed text-neutral-500">
              We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital landscape. Our approach combines creative thinking with technical expertise to deliver solutions that make a real impact.
            </p>
            <div className="mb-8 space-y-4">
              {[
                'Expert team with 7+ years of industry experience',
                'Proven track record with 200+ successful projects',
                'End-to-end service from strategy to deployment',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Check className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-neutral-600">{item}</span>
                </div>
              ))}
            </div>
            <Button className="group h-11 rounded-full bg-neutral-900 px-7 text-sm text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl">
              Learn More About Us <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-50">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <span className="text-3xl font-bold text-white">7+</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-400">Years of Excellence</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
              <p className="text-3xl font-bold text-neutral-900">200+</p>
              <p className="text-sm text-neutral-400">Projects Done</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorksSection() {
  const { data } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => api.get<{ portfolios: Portfolio[] }>('/portfolios/published').then(r => r.data.portfolios || []),
  })
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const items = data?.slice(0, 6) ?? []

  return (
    <section id="works" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-600">
            Portfolio
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Featured projects
            <br />
            we&apos;re <span className="text-blue-500">proud of</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? items.map((project, i) => (
            <div
              key={project._id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Code2 className="h-12 w-12 text-neutral-200" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {project.techUsed?.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                      {tech}
                    </span>
                  ))}
                  {(project.techUsed?.length ?? 0) > 3 && (
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-400">
                      +{project.techUsed!.length - 3}
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-neutral-900">{project.title}</h3>
                {project.description && (
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-400">{project.description}</p>
                )}
                {project.impact && (
                  <p className="mb-4 text-sm font-medium text-emerald-600">{project.impact}</p>
                )}
                <div className="flex items-center gap-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 transition-colors hover:text-blue-600"
                    >
                      Live Site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.client && (
                    <span className="text-xs text-neutral-300">— {project.client}</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-neutral-100" />
            ))
          )}
        </div>

        <div className="mt-14 text-center">
          <Button
            variant="outline"
            className="group h-11 rounded-full border-neutral-300 px-7 text-sm transition-all hover:border-neutral-400 hover:shadow-lg"
            onClick={() => navigate('/portfolio')}
          >
            View All Projects <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Ready to start your
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            next project?
          </span>
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-white/30">
          Let&apos;s discuss your ideas and turn them into reality. Our team is ready to help you build something amazing.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            className="group h-12 rounded-full bg-white px-8 text-sm font-medium text-neutral-900 shadow-2xl transition-all hover:bg-white/90 hover:shadow-white/20"
            onClick={() => navigate('/register')}
          >
            Get Started Free <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <button className="text-sm font-medium text-white/30 transition-colors hover:text-white">
            Talk to our team
          </button>
        </div>
      </div>
    </section>
  )
}

function PartnerSection() {
  const { data } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.get<{ partners: Partner[] }>('/partners').then(r => r.data.partners),
  })
  const [errored, setErrored] = useState<Set<string>>(new Set())

  if (!data?.length) return null

  return (
    <section id="partners" className="relative overflow-hidden bg-neutral-950 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/40 backdrop-blur-sm">
            Partners
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Trusted by industry leaders across Bangladesh
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data.map((partner) => (
            <div
              key={partner._id}
              className="group flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
            >
              {errored.has(partner._id) ? (
                <span className="text-sm font-semibold tracking-wide text-white/20">{partner.name}</span>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 object-contain opacity-30 grayscale transition-all duration-300 group-hover:opacity-60 group-hover:grayscale-0"
                  onError={() => setErrored(prev => new Set(prev).add(partner._id))}
                />
              )}
            </div>
          ))}
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
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section id="reviews" className="overflow-hidden bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Testimonials
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            What our clients
            <br />
            <span className="text-blue-500">say about us</span>
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {data?.map((review) => (
            <div
              key={review._id}
              className="group relative min-w-[380px] flex-shrink-0 rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-neutral-50" />
              <div className="mb-5 flex gap-1">
                {Array.from({ length: review.rating || 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-7 text-sm leading-relaxed text-neutral-500">
                &ldquo;{review.description}&rdquo;
              </p>
              <div className="flex items-center gap-3.5">
                {review.image ? (
                  <img src={review.image} alt={review.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-neutral-100" />
                ) : (
                  <Avatar className="h-11 w-11 ring-2 ring-neutral-100">
                    <AvatarFallback className="bg-neutral-100 text-sm text-neutral-600">
                      {review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                  {review.designation && (
                    <p className="text-xs text-neutral-400">{review.designation}</p>
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

function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-neutral-50 py-28">
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Get in Touch
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              Let&apos;s work
              <br />
              <span className="text-blue-500">together</span>
            </h2>
            <p className="mb-10 leading-relaxed text-neutral-500">
              Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'hello@appit.com', href: 'mailto:hello@appit.com' },
                { icon: Phone, label: 'Phone', value: '+880 1234-567890', href: 'tel:+8801234567890' },
                { icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh' },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
                    <info.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium text-neutral-900 transition-colors hover:text-blue-500">{info.value}</a>
                    ) : (
                      <p className="text-sm font-medium text-neutral-900">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  placeholder="Your Name"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
                <input
                  placeholder="Your Email"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>
              <input
                placeholder="Subject"
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              />
              <textarea
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              />
              <Button className="group h-12 w-full rounded-full bg-neutral-900 text-sm font-medium text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="border-t border-neutral-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
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
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400">Services</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Web Development</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Mobile Apps</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">UI/UX Design</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Cloud Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><a href="#works" className="transition-colors hover:text-neutral-900">Portfolio</a></li>
              <li><a href="#partners" className="transition-colors hover:text-neutral-900">Partners</a></li>
              <li><a href="#reviews" className="transition-colors hover:text-neutral-900">Testimonials</a></li>
              <li><a href="#contact" className="transition-colors hover:text-neutral-900">Contact</a></li>
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

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <WorksSection />
      <CTASection />
      <PartnerSection />
      <ReviewSection />
      <ContactSection />
      <FooterSection />
    </>
  )
}
