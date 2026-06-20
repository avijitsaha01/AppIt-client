import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import type { TeamMember } from '@/types'
import { ExternalLink } from 'lucide-react'

const deptLabels: Record<string, string> = {
  'CEO': 'Management',
  'CTO': 'Management',
  'COO': 'Management',
  'Lead': 'Management',
}

function getDept(role: string): string {
  for (const [key, value] of Object.entries(deptLabels)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return value
  }
  return 'Team'
}

export default function Team() {
  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => api.get<{ members: TeamMember[] }>('/team-members').then(r => r.data.members),
  })

  const grouped = members?.reduce((acc, m) => {
    const dept = getDept(m.role)
    if (!acc[dept]) acc[dept] = []
    acc[dept].push(m)
    return acc
  }, {} as Record<string, TeamMember[]>)

  return (
    <div>
      <PageHero
        label="Our Team"
        title="Meet the people behind AppIt"
        subtitle="A diverse team of passionate creators, engineers, and strategists working together to build amazing things."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !members?.length ? (
            <EmptyState title="No team members to show yet" />
          ) : (
            <div className="space-y-16">
              {Object.entries(grouped || {}).map(([dept, deptMembers]) => (
                <div key={dept}>
                  <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1 text-sm font-medium text-neutral-600">
                    {dept}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {deptMembers.map((member) => (
                      <div key={member._id} className="group rounded-2xl border border-neutral-100 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl">
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
                        {member.socialLinks && member.socialLinks.length > 0 && (
                          <div className="mt-4 flex justify-center gap-2">
                              {member.socialLinks.map((link, i) => (
                              <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
            Our Culture
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Built on <span className="text-blue-500">collaboration</span> and <span className="text-blue-500">creativity</span>
          </h2>
          <p className="mx-auto max-w-2xl text-neutral-500 leading-relaxed">
            We believe in fostering an environment where great ideas can flourish. Our culture is built on trust, continuous learning, and a shared passion for building exceptional digital products. We celebrate diversity, encourage experimentation, and support each other to grow both personally and professionally.
          </p>
        </div>
      </section>
    </div>
  )
}
