import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageHero } from '@/components/shared/page-hero'
import { Button } from '@/components/ui/button'
import { Send, Mail, Phone, MapPin, Check } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: () => api.post('/contact-requests', form),
    onSuccess: () => {
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div>
      <PageHero
        label="Contact"
        title="Let's start a conversation"
        subtitle="Have a project in mind? We'd love to hear from you. Send us a message and we'll get back within 24 hours."
        dark
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
                Get in Touch
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Let&apos;s work{' '}
                <span className="text-blue-500">together</span>
              </h2>
              <p className="mb-10 text-neutral-500">
                We&apos;re here to help you turn your ideas into reality. Whether you have a specific project or just a rough concept, reach out and we&apos;ll figure out the best path forward.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@appit.com', href: 'mailto:hello@appit.com' },
                  { icon: Phone, label: 'Phone', value: '+880 1234-567890', href: 'tel:+8801234567890' },
                  { icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh' },
                ].map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                      <info.icon className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium uppercase tracking-wider text-neutral-400">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-medium text-neutral-900 hover:text-blue-500 transition-colors">{info.value}</a>
                      ) : (
                        <p className="text-sm font-medium text-neutral-900">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200">
                <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                  Google Map Integration
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">Message Sent!</h3>
                  <p className="mt-2 text-sm text-neutral-500">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <Button className="mt-6 rounded-full" variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <input
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                      required
                    />
                  </div>
                  <input
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                  />
                  <input
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-neutral-400"
                    required
                  />
                  <textarea
                    rows={5}
                    placeholder="Tell us about your project..."
                    value={form.message}
                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-full bg-neutral-900 text-sm text-white hover:bg-neutral-800"
                    disabled={mutation.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {mutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
