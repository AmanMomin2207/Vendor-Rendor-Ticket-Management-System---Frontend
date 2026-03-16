'use client'
import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { DashboardResponse } from '@/types'
import StatCard from '@/components/ui/StatCard'
import { StatSkeleton } from '@/components/ui/Skeleton'
import { Ticket, CircleDot, CheckCircle2, XCircle, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function BuyerDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.buyer()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
          <LayoutDashboard size={12} />
          <span>Dashboard</span>
        </div>
        <h1 className="font-display text-2xl font-700 text-white">Overview</h1>
        <p className="text-white/40 text-sm mt-1">Your ticket activity at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Tickets" value={data?.total ?? 0} icon={Ticket} color="text-indigo-400" delay={0} />
            <StatCard label="Open" value={data?.open ?? 0} icon={CircleDot} color="text-blue-400" delay={60} />
            <StatCard label="Resolved" value={data?.resolved ?? 0} icon={CheckCircle2} color="text-emerald-400" delay={120} />
            <StatCard label="Closed" value={data?.closed ?? 0} icon={XCircle} color="text-zinc-400" delay={180} />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/tickets/new"
          className="glass rounded-xl border border-white/5 p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3">
            <Ticket size={18} className="text-indigo-400" />
          </div>
          <h3 className="font-display font-600 text-white group-hover:text-indigo-300 transition-colors">
            Create New Ticket
          </h3>
          <p className="text-white/40 text-sm mt-1">
            Report an issue or raise a support request
          </p>
        </Link>

        <Link
          href="/tickets"
          className="glass rounded-xl border border-white/5 p-5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3">
            <CircleDot size={18} className="text-white/50" />
          </div>
          <h3 className="font-display font-600 text-white">View All Tickets</h3>
          <p className="text-white/40 text-sm mt-1">
            Browse and manage your submitted tickets
          </p>
        </Link>
      </div>

      {/* Status guide */}
      <div className="glass rounded-2xl border border-white/5 p-6">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Ticket Lifecycle</p>
        <div className="flex items-center gap-0 flex-wrap">
          {[
            { label: 'OPEN', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
            { label: 'ASSIGNED', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
            { label: 'IN PROGRESS', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
            { label: 'RESOLVED', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            { label: 'CLOSED', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center">
              <span className={`badge ${step.color} text-xs`}>{step.label}</span>
              {i < arr.length - 1 && (
                <span className="text-white/20 mx-2 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-white/25 text-xs mt-3">
          You can close a ticket once it's marked as RESOLVED by the vendor.
        </p>
      </div>
    </div>
  )
}
