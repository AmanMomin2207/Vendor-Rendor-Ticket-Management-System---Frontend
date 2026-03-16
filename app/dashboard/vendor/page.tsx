'use client'
import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { DashboardResponse } from '@/types'
import StatCard from '@/components/ui/StatCard'
import { StatSkeleton } from '@/components/ui/Skeleton'
import { Ticket, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function VendorDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.vendor()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
          <LayoutDashboard size={12} />
          <span>Vendor Dashboard</span>
        </div>
        <h1 className="font-display text-2xl font-700 text-white">My Work Queue</h1>
        <p className="text-white/40 text-sm mt-1">Track and resolve your assigned tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Assigned" value={data?.total ?? 0} icon={Ticket} color="text-indigo-400" delay={0} />
            <StatCard label="In Progress" value={data?.inProgress ?? 0} icon={Clock} color="text-amber-400" delay={60} />
            <StatCard label="Resolved" value={data?.resolved ?? 0} icon={CheckCircle2} color="text-emerald-400" delay={120} />
          </>
        )}
      </div>

      {/* Workflow guide */}
      <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Your Workflow</p>
        <div className="space-y-3">
          {[
            { step: '1', status: 'ASSIGNED', action: 'Ticket assigned to you', color: 'text-purple-400' },
            { step: '2', status: 'IN PROGRESS', action: 'Mark as In Progress when you start working', color: 'text-amber-400' },
            { step: '3', status: 'RESOLVED', action: 'Mark as Resolved when done', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40 flex-shrink-0">
                {item.step}
              </div>
              <span className={`text-xs font-mono ${item.color}`}>{item.status}</span>
              <span className="text-white/40 text-xs">— {item.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/tickets"
        className="flex items-center gap-3 glass rounded-xl border border-white/5 p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
      >
        <Ticket size={18} className="text-indigo-400" />
        <div>
          <h3 className="font-display font-600 text-white group-hover:text-indigo-300 transition-colors">
            View Assigned Tickets
          </h3>
          <p className="text-white/40 text-sm">Browse and update your assigned tickets</p>
        </div>
      </Link>
    </div>
  )
}
