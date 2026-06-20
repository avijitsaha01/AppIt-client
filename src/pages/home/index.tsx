import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { Service, Partner, Slider, Review } from '@/types'
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function HeroSection() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-900 py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          Your Vision, <span className="text-blue-400">Our Code</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300">
          We build modern digital solutions that transform businesses. From web apps to mobile experiences.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/register')}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Our Services
          </Button>
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

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold">Our Services</h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-neutral-600">
          We offer a wide range of IT services to help your business grow
        </p>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((service) => (
              <Card
                key={service._id}
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => {
                  if (!user) { navigate('/login'); return }
                  navigate('/dashboard/order', { state: { service } })
                }}
              >
                <CardContent className="p-6">
                  {service.image && (
                    <img src={service.image} alt={service.title} className="mb-4 h-48 w-full rounded-lg object-cover" />
                  )}
                  <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                  <p className="text-sm text-neutral-600">{service.description}</p>
                </CardContent>
              </Card>
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
    <section className="border-t bg-neutral-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-2xl font-bold">Trusted Partners</h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {data?.map((partner) => (
            <img
              key={partner._id}
              src={partner.logo}
              alt={partner.name}
              className="h-12 object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
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

  if (!slides.length) return null

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1))

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
          <div className="relative aspect-[21/9]">
            <img
              src={slides[current].image}
              alt={slides[current].title || 'Slider'}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              {slides[current].title && (
                <h3 className="mb-2 text-3xl font-bold">{slides[current].title}</h3>
              )}
              {slides[current].subtitle && (
                <p className="text-lg text-neutral-300">{slides[current].subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
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
    <section className="border-t bg-neutral-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">What Our Clients Say</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  {review.image && (
                    <img src={review.image} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    {review.designation && (
                      <div className="text-sm text-neutral-500">{review.designation}</div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-600">&ldquo;{review.description}&rdquo;</p>
                {review.rating && (
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ServicesSection />
      <PartnerSection />
      <SliderSection />
      <ReviewSection />
      <Footer />
    </>
  )
}
