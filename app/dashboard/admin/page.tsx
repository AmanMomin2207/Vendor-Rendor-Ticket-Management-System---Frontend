'use client'
import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { DashboardResponse } from '@/types'
import StatCard from '@/components/ui/StatCard'
import { StatSkeleton } from '@/components/ui/Skeleton'
import {
  Ticket, CircleDot, Clock, CheckCircle2, XCircle, LayoutDashboard, Users, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(data);

    dashboardApi.admin()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  const resolutionRate = data && data.total > 0
    ? Math.round(((data.resolved + data.closed) / data.total) * 100)
    : 0

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
          <LayoutDashboard size={12} />
          <span>Admin Dashboard</span>
        </div>
        <h1 className="font-display text-2xl font-700 text-white">System Overview</h1>
        <p className="text-white/40 text-sm mt-1">Monitor all tickets across the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total" value={data?.total ?? 0} icon={Ticket} color="text-white/60" delay={0} />
            <StatCard label="Open" value={data?.open ?? 0} icon={CircleDot} color="text-blue-400" delay={50} />
            <StatCard label="In Progress" value={data?.inProgress ?? 0} icon={Clock} color="text-amber-400" delay={100} />
            <StatCard label="Resolved" value={data?.resolved ?? 0} icon={CheckCircle2} color="text-emerald-400" delay={150} />
            <StatCard label="Closed" value={data?.closed ?? 0} icon={XCircle} color="text-zinc-400" delay={200} />
          </>
        )}
      </div>

      {/* Resolution rate */}
      {!loading && data && (
        <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-emerald-400" />
              <p className="text-white/60 text-sm">Resolution Rate</p>
            </div>
            <span className="text-2xl font-display font-700 text-white">{resolutionRate}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
          <p className="text-white/25 text-xs mt-2">
            {data.resolved + data.closed} out of {data.total} tickets resolved or closed
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/tickets"
          className="glass rounded-xl border border-white/5 p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
        >
          <Ticket size={18} className="text-indigo-400 mb-3" />
          <h3 className="font-display font-600 text-white group-hover:text-indigo-300 transition-colors">
            Manage Tickets
          </h3>
          <p className="text-white/40 text-sm mt-1">Assign, filter, and export tickets</p>
        </Link>

        <Link
          href="/users"
          className="glass rounded-xl border border-white/5 p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
        >
          <Ticket size={18} className="text-indigo-400 mb-3" />
          <h3 className="font-display font-600 text-white group-hover:text-indigo-300 transition-colors">
            Manage Users
          </h3>
          <p className="text-white/40 text-sm mt-1">Manage Users</p>
        </Link>
        
        <div className="glass rounded-xl border border-white/5 p-5">
          <CircleDot size={18} className="text-blue-400 mb-3" />
          <h3 className="font-display font-600 text-white">Open Tickets</h3>
          <p className="text-white/40 text-sm mt-1">
            <span className="text-blue-400 font-mono">{data?.open ?? '—'}</span> tickets awaiting assignment
          </p>
        </div>

        
      </div>
    </div>
  )
}
