import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { JobApplication } from '@/types'
import { cn } from '@/lib/utils'
import { Users, Download } from 'lucide-react'

const statusConfig: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  reviewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  rejected: 'bg-red-50 text-red-700',
}

export default function ManageApplications() {
  const queryClient = useQueryClient()

  const { data: applications, isLoading } = useQuery({
    queryKey: ['job-applications'],
    queryFn: () => api.get<{ applications: JobApplication[] }>('/job-applications').then(r => r.data.applications),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/job-applications/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-applications'] }),
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Job Applications</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Review and manage job applications.</p>
      </div>

      {!applications?.length ? (
        <EmptyState icon={Users} title="No applications yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Applicant</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Position</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Email</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {applications.map((app) => (
                <tr key={app._id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-neutral-900">{app.name}</p>
                    <p className="text-[12px] text-neutral-500">{app.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">{(app.job as any)?.title || '—'}</td>
                  <td className="px-5 py-3.5 text-[13px] text-neutral-600">{app.email}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => statusMutation.mutate({ id: app._id, status: e.target.value })}
                      className={cn('rounded-full border-0 px-2.5 py-0.5 text-[11px] font-medium outline-none', statusConfig[app.status])}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    {app.resumeFile ? (
                      <a href={app.resumeFile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-600">
                        <Download className="h-3.5 w-3.5" /> Resume
                      </a>
                    ) : (
                      <span className="text-[12px] text-neutral-400">No file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {applications && applications.filter(a => a.coverLetter).length > 0 && (
        <div className="rounded-xl border border-neutral-200/70 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-neutral-900">Cover Letters</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {applications.filter(a => a.coverLetter).map((app) => (
              <div key={app._id} className="px-5 py-4">
                <p className="text-[13px] font-medium text-neutral-900 mb-1">{app.name} — {(app.job as any)?.title}</p>
                <p className="text-[12px] text-neutral-500">{app.coverLetter}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
