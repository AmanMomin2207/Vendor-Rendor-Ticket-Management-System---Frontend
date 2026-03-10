'use client'
import { useEffect, useState } from 'react'
import { ticketApi } from '@/lib/api'
import { TicketHistory } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Loader2, History, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TicketTimeline({ ticketId }: { ticketId: string }) {
  const [history, setHistory] = useState<TicketHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ticketApi.getHistory(ticketId)
      .then(res => setHistory(res.data.data))
      .finally(() => setLoading(false))
  }, [ticketId])

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <Loader2 size={18} className="animate-spin text-indigo-400" />
    </div>
  )

  if (!history.length) return (
    <div className="flex flex-col items-center justify-center py-8 text-white/25">
      <History size={20} className="mb-2" />
      <p className="text-sm">No history yet</p>
    </div>
  )

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-4 bottom-4 w-px bg-white/5" />

      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="flex gap-4 items-start"
            style={{ animation: `slideUp 0.3s ease both`, animationDelay: `${index * 60}ms` }}
          >
            {/* Dot */}
            <div className="relative z-10 w-7 h-7 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
            </div>

            {/* Content */}
            <div className="flex-1 glass rounded-xl border border-white/5 px-4 py-3 mb-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('badge text-xs', getStatusColor(item.oldStatus))}>
                  {getStatusLabel(item.oldStatus)}
                </span>
                <ArrowRight size={12} className="text-white/25" />
                <span className={cn('badge text-xs', getStatusColor(item.newStatus))}>
                  {getStatusLabel(item.newStatus)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/30 text-xs font-mono">
                  by {item.changedBy?.slice(-8) ?? 'system'}
                </p>
                <p className="text-white/25 text-xs">
                  {formatDate(item.changedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}