import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { EmptyState } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { Invoice } from '@/types'
import { cn } from '@/lib/utils'
import { Receipt, Download } from 'lucide-react'

const statusConfig: Record<string, { label: string; bg: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700' },
  paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700' },
  overdue: { label: 'Overdue', bg: 'bg-red-50 text-red-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-neutral-100 text-neutral-600' },
}

export default function Invoices() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<{ invoices: Invoice[] }>('/invoices').then(r => r.data.invoices),
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Invoices</h1>
        <p className="mt-1 text-[13px] text-neutral-500">View and download your invoices.</p>
      </div>

      {!invoices?.length ? (
        <EmptyState icon={Receipt} title="No invoices yet" description="Invoices will appear here once you place orders." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/70 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Invoice</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Order</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Amount</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Due Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status]
                return (
                  <tr key={invoice._id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-neutral-900">
                        INV-{invoice._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-neutral-600">
                        {(invoice.order as any)?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-neutral-900">
                        ${invoice.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', status.bg)}>
                        {status.label}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
