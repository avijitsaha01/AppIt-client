import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import type { TeamMember } from '@/types'
import { Check, Target, Eye, Award, Users, ArrowRight } from 'lucide-react'

const values = [
  { icon: Users, title: 'Innovation First', desc: 'We push boundaries with creative thinking and cutting-edge technology.' },
  { icon: Target, title: 'Client Focused', desc: 'Your success is our success. We prioritize your goals at every step.' },
  { icon: Eye, title: 'Transparency', desc: 'Clear communication and honest reporting throughout every project.' },
  { icon: Award, title: 'Quality Driven', desc: 'We never compromise on quality, delivering excellence in every line of code.' },
]

export default function About() {
  const navigate = useNavigate()

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => api.get<{ members: TeamMember[] }>('/team-members').then(r => r.data.members),
  })

  return (
    <div>
      <PageHero
        label="About Us"
        title="We craft digital solutions that drive growth"
        subtitle="We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital landscape."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
                Our Story
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                From a small idea to a{' '}
                <span className="text-blue-500">digital powerhouse</span>
              </h2>
              <p className="mb-6 leading-relaxed text-neutral-500">
                Founded in 2018, AppIt started as a two-person team with a vision to make modern technology accessible to businesses of all sizes. Over the years, we&apos;ve grown into a full-service digital agency serving clients worldwide.
              </p>
              <p className="leading-relaxed text-neutral-500">
                Our team has successfully delivered over 200 projects, ranging from simple websites to complex enterprise systems. Every project teaches us something new, and we bring that experience to every client we work with.
              </p>
              <Button className="mt-8 h-11 rounded-full bg-neutral-900 px-7 text-sm text-white hover:bg-neutral-800" onClick={() => navigate('/contact')}>
                Get in Touch <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-6xl font-bold text-neutral-900">7+</p>
                <p className="mt-2 text-sm font-medium text-neutral-500">Years of Excellence</p>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl border bg-white p-5 shadow-lg">
                <p className="text-2xl font-bold text-neutral-900">200+</p>
                <p className="text-sm text-neutral-500">Projects Done</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
              Mission & Vision
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-neutral-900">Our Mission</h3>
              <p className="leading-relaxed text-neutral-500">
                To empower businesses with innovative digital solutions that drive growth, efficiency, and competitive advantage. We strive to make advanced technology accessible and impactful for every client we serve.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-neutral-900">Our Vision</h3>
              <p className="leading-relaxed text-neutral-500">
                To be the most trusted digital partner for businesses worldwide, known for delivering exceptional quality, fostering innovation, and creating lasting impact through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-600">
              Our Values
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              What <span className="text-blue-500">drives us</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="group rounded-2xl border border-neutral-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <v.icon className="h-6 w-6 text-neutral-600 group-hover:text-white" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-neutral-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-600">
              Our Team
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Meet the <span className="text-blue-500">team</span>
            </h2>
          </div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : !members?.length ? (
            <EmptyState title="No team members yet" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <div key={member._id} className="group rounded-2xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-2xl font-bold text-neutral-500">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">{member.name}</h3>
                  <p className="mt-1 text-sm text-blue-500">{member.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-500">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
              Certifications
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Our <span className="text-blue-500">achievements</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { year: '2023', title: 'Best Digital Agency', org: 'Tech Awards Global' },
              { year: '2022', title: 'Top Web Development Company', org: 'Clutch' },
              { year: '2021', title: 'ISO 27001 Certified', org: 'Security Standards' },
            ].map((cert) => (
              <div key={cert.year} className="flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-sm font-bold text-neutral-900">
                  {cert.year}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{cert.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400">{cert.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
