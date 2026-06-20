import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import type { Service, Partner, Slider, Review } from '@/types'
import { ArrowRight, Star, ChevronRight, Menu, X, Play, Check, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
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
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white">
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
                'text-sm font-medium transition-colors',
                scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/70 hover:text-white',
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
                'h-10 rounded-full px-6 text-sm font-medium',
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
                  scrolled ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/70 hover:text-white',
                )}
              >
                Login
              </button>
              <Button
                className={cn(
                  'h-10 rounded-full px-6 text-sm font-medium',
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
        <div className="border-t bg-white px-5 pb-8 pt-5 md:hidden">
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

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute left-1/2 top-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-sm text-white/60 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          We&apos;re hiring — join our team
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
          We Build
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Digital Excellence
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-white/40 md:text-lg">
          We craft modern digital solutions that transform businesses. From web apps to mobile experiences — we bring ideas to life with precision and creativity.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            className="h-12 rounded-full bg-white px-8 text-sm font-medium text-neutral-900 shadow-2xl hover:bg-white/90"
            onClick={() => navigate('/register')}
          >
            Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button className="group flex items-center gap-3 text-sm font-medium text-white/50 transition-colors hover:text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/40">
              <Play className="h-4 w-4 fill-white pl-0.5 text-white" />
            </span>
            Watch the Showreel
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-12">
          {[
            { label: 'Projects Delivered', value: '200+' },
            { label: 'Happy Clients', value: '98%' },
            { label: 'Years Experience', value: '7+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm text-white/30">{stat.label}</p>
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
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1 text-sm font-medium text-neutral-600">
            What We Do
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            We provide the best
            <br />
            <span className="text-blue-500">digital services</span>
          </h2>
          <p className="mt-4 max-w-lg text-neutral-500">
            From strategy to execution, we deliver end-to-end solutions that drive real results for your business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((service, i) => (
            <div
              key={service._id}
              className="group cursor-pointer rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl"
              onClick={() => {
                if (!user) { navigate('/login'); return }
                navigate('/dashboard/order', { state: { service } })
              }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 text-lg font-bold text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-3 text-lg font-semibold text-neutral-900">{service.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{service.description}</p>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                Learn More <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="bg-neutral-50 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
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
            <Button className="h-11 rounded-full bg-neutral-900 px-7 text-sm text-white hover:bg-neutral-800">
              Learn More About Us <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-neutral-900">7+</p>
                <p className="mt-2 text-sm font-medium text-neutral-500">Years of Excellence</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl border bg-white p-5 shadow-lg">
              <p className="text-2xl font-bold text-neutral-900">200+</p>
              <p className="text-sm text-neutral-500">Projects Done</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorksSection() {
  const { data } = useQuery({
    queryKey: ['sliders'],
    queryFn: () => api.get<{ sliders: Slider[] }>('/sliders').then(r => r.data.sliders),
  })
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <section id="works" className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
            Our Works
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Featured projects
            <br />
            we&apos;re <span className="text-blue-500">proud of</span>
          </h2>
        </div>

        {data && data.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.slice(0, 3).map((slide, i) => (
              <div
                key={slide._id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-100"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title || 'Project'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  {slide.title && <h3 className="text-lg font-semibold text-white">{slide.title}</h3>}
                  {slide.subtitle && <p className="mt-1 text-sm text-white/70">{slide.subtitle}</p>}
                  <button className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-blue-400">
                    View Project <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-neutral-100" />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="h-11 rounded-full border-neutral-300 px-7 text-sm"
            onClick={() => { if (!user) navigate('/login'); else navigate('/dashboard/service-list') }}
          >
            View All Projects <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="bg-neutral-950 py-24">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Ready to start your
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            next project?
          </span>
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-white/40">
          Let&apos;s discuss your ideas and turn them into reality. Our team is ready to help you build something amazing.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            className="h-12 rounded-full bg-white px-8 text-sm font-medium text-neutral-900 hover:bg-white/90"
            onClick={() => navigate('/register')}
          >
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button className="text-sm font-medium text-white/40 transition-colors hover:text-white">
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
    <section id="partners" className="border-b bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">Trusted by industry leaders</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {data.map((partner) => (
            <div key={partner._id} className="flex h-10 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0">
              {errored.has(partner._id) ? (
                <span className="text-sm font-semibold text-neutral-300">{partner.name}</span>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full object-contain opacity-40 transition-opacity hover:opacity-70"
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

  return (
    <section id="reviews" className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-600">
            Testimonials
          </div>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            What our clients
            <br />
            <span className="text-blue-500">say about us</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((review, i) => (
            <div
              key={review._id}
              className="group rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
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
                  <img src={review.image} alt={review.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <Avatar className="h-11 w-11">
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
    <section id="contact" className="bg-neutral-50 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
              Contact
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              Let&apos;s work
              <br />
              <span className="text-blue-500">together</span>
            </h2>
            <p className="mb-8 text-neutral-500">
              Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Email', value: 'hello@appit.com' },
                { label: 'Phone', value: '+880 1234-567890' },
                { label: 'Location', value: 'Dhaka, Bangladesh' },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="text-sm font-medium text-neutral-900 w-20">{info.label}</div>
                  <div className="text-sm text-neutral-500">{info.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  placeholder="Your Name"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                />
                <input
                  placeholder="Your Email"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                />
              </div>
              <input
                placeholder="Subject"
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
              />
              <textarea
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
              />
              <Button className="h-12 w-full rounded-full bg-neutral-900 text-sm text-white hover:bg-neutral-800">
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
            <h4 className="mb-5 text-sm font-semibold text-neutral-900">Services</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Web Development</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Mobile Apps</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">UI/UX Design</a></li>
              <li><a href="#services" className="transition-colors hover:text-neutral-900">Cloud Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm font-semibold text-neutral-900">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#about" className="transition-colors hover:text-neutral-900">About</a></li>
              <li><a href="#works" className="transition-colors hover:text-neutral-900">Portfolio</a></li>
              <li><a href="#partners" className="transition-colors hover:text-neutral-900">Partners</a></li>
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
