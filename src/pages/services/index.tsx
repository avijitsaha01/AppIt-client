import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import type { Service } from '@/types'
import { ChevronRight, ArrowRight, Code, Smartphone, Palette, Cloud, Cpu, Database, Wrench, Brain } from 'lucide-react'

const serviceIcons: Record<string, any> = {
  'Custom Software Development': Code,
  'Web Development': Code,
  'Mobile App Development': Smartphone,
  'UI/UX Design': Palette,
  'SaaS Development': Cloud,
  'ERP/CRM Development': Database,
  'Cloud & DevOps': Cpu,
  'Maintenance & Support': Wrench,
  'AI Solutions': Brain,
}

const processSteps = [
  { step: '01', title: 'Discovery', desc: 'Understanding your business, goals, and requirements through in-depth consultation.' },
  { step: '02', title: 'Strategy', desc: 'Creating a roadmap with clear milestones, timelines, and technical architecture.' },
  { step: '03', title: 'Design', desc: 'Crafting intuitive user experiences with modern design principles.' },
  { step: '04', title: 'Development', desc: 'Building with clean code, agile methodology, and regular updates.' },
  { step: '05', title: 'Testing', desc: 'Rigorous quality assurance to ensure reliability and performance.' },
  { step: '06', title: 'Deploy & Support', desc: 'Smooth deployment with ongoing maintenance and dedicated support.' },
]

export default function Services() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get<{ services: Service[] }>('/services').then(r => r.data.services),
  })

  return (
    <div>
      <PageHero
        label="Our Services"
        title="Comprehensive digital solutions for your business"
        subtitle="From strategy to execution, we deliver end-to-end services that drive real results."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
              What We Offer
            </div>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Everything you need to{' '}
              <span className="text-blue-500">succeed online</span>
            </h2>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : !services?.length ? (
            <EmptyState title="No services available yet" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => {
                const Icon = serviceIcons[service.title] || Code
                return (
                  <div
                    key={service._id}
                    className="group cursor-pointer rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl"
                    onClick={() => {
                      if (!user) { navigate('/login'); return }
                      navigate('/dashboard/order', { state: { service } })
                    }}
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-neutral-900">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-500">{service.description}</p>
                    <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      Get Started <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
              Our Process
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              How we <span className="text-blue-500">deliver results</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.step} className="flex gap-5 rounded-2xl border border-neutral-200 bg-white p-8">
                <span className="text-3xl font-bold text-blue-500/30">{step.step}</span>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-neutral-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Ready to start your project?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-neutral-500">
            Let&apos;s discuss your ideas and find the perfect solution for your business needs.
          </p>
          <Button
            className="h-12 rounded-full bg-neutral-900 px-8 text-sm text-white hover:bg-neutral-800"
            onClick={() => navigate('/contact')}
          >
            Talk to Our Team <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
