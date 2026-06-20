import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import type { Job } from '@/types'
import { cn } from '@/lib/utils'
import { MapPin, Clock, Send, X, Check } from 'lucide-react'

const jobTypeConfig = {
  'full-time': { label: 'Full Time', color: 'bg-blue-100 text-blue-700' },
  'part-time': { label: 'Part Time', color: 'bg-purple-100 text-purple-700' },
  'contract': { label: 'Contract', color: 'bg-amber-100 text-amber-700' },
  'internship': { label: 'Internship', color: 'bg-emerald-100 text-emerald-700' },
}

const processSteps = [
  { step: '1', title: 'Apply Online', desc: 'Submit your application through our portal.' },
  { step: '2', title: 'Screening', desc: 'Our team reviews your profile and experience.' },
  { step: '3', title: 'Interview', desc: 'Meet with our team to discuss your potential.' },
  { step: '4', title: 'Offer', desc: 'Welcome to the team — start your journey with us!' },
]

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverLetter: '' })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', 'open'],
    queryFn: () => api.get<{ jobs: Job[] }>('/jobs/open').then(r => r.data.jobs),
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('job', selectedJob!._id)
      fd.append('name', formData.name)
      fd.append('email', formData.email)
      fd.append('phone', formData.phone)
      if (formData.coverLetter) fd.append('coverLetter', formData.coverLetter)
      if (resumeFile) fd.append('resumeFile', resumeFile)
      await api.post('/job-applications', fd)
    },
    onSuccess: () => {
      setSubmitted(true)
      setShowForm(false)
      setFormData({ name: '', email: '', phone: '', coverLetter: '' })
      setResumeFile(null)
    },
  })

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setShowForm(true)
    setSubmitted(false)
  }

  return (
    <div>
      <PageHero
        label="Careers"
        title="Join us and build the future"
        subtitle="We're looking for talented individuals who are passionate about technology and innovation."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
              Open Positions
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Current <span className="text-blue-500">opportunities</span>
            </h2>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : !jobs?.length ? (
            <EmptyState title="No open positions right now" description="Check back later for new opportunities." />
          ) : (
            <div className="mx-auto max-w-4xl space-y-4">
              {jobs.map((job) => {
                const type = jobTypeConfig[job.type]
                const deadline = new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                return (
                  <div key={job._id} className="group rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
                          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium', type.color)}>
                            {type.label}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> Apply by {deadline}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-500 line-clamp-2">{job.description}</p>
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {job.requirements.slice(0, 3).map((req) => (
                              <span key={req} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="text-[11px] text-neutral-400">+{job.requirements.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        className="shrink-0 rounded-full"
                        onClick={() => handleApply(job)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
              Recruitment Process
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              How we <span className="text-blue-500">hire</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
                  {step.step}
                </div>
                <h3 className="mb-2 text-base font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-sm text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showForm && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Apply for {selectedJob.title}</h3>
                <p className="text-sm text-neutral-500">{selectedJob.location}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}>
              <input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-neutral-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-neutral-400"
                required
              />
              <input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-neutral-400"
                required
              />
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 block">Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Cover Letter (optional)"
                value={formData.coverLetter}
                onChange={(e) => setFormData(f => ({ ...f, coverLetter: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />
              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-neutral-900 text-sm text-white hover:bg-neutral-800"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Submitting...' : <><Send className="mr-2 h-4 w-4" /> Submit Application</>}
              </Button>
            </form>
          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSubmitted(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Application Submitted!</h3>
            <p className="mt-2 text-sm text-neutral-500">We&apos;ll review your application and get back to you soon.</p>
            <Button className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
