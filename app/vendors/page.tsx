'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Loader2, TrendingUp, Clock, CheckCircle2,
  Users, BarChart3, Award, AlertCircle
} from 'lucide-react'
import { vendorStatsApi } from '@/lib/api'
import { VendorStats } from '@/types'
import { cn } from '@/lib/utils'

export default function VendorStatsPage() {
  const [stats, setStats] = useState<VendorStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    vendorStatsApi.getAll()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load vendor stats'))
      .finally(() => setLoading(false))
  }, [])

  const topVendor = stats.length
    ? stats.reduce((a, b) => a.resolutionRate >= b.resolutionRate ? a : b)
    : null

  const getRateColor = (rate: number) => {
    if (rate >= 75) return 'text-emerald-400'
    if (rate >= 40) return 'text-amber-400'
    return 'text-red-400'
  }

  const getRateBarColor = (rate: number) => {
    if (rate >= 75) return 'from-emerald-500 to-emerald-400'
    if (rate >= 40) return 'from-amber-500 to-amber-400'
    return 'from-red-500 to-red-400'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
        <BarChart3 size={12} /> Vendor Performance
      </div>
      <h1 className="font-display text-2xl font-700 text-white mb-1">
        Vendor Stats
      </h1>
      <p className="text-white/40 text-sm mb-6">
        Track resolution rates and response times per vendor
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin text-indigo-400" />
        </div>
      ) : stats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/25">
          <Users size={32} className="mb-3" />
          <p>No vendors found</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Total Vendors',
                value: stats.length,
                icon: Users,
                color: 'text-indigo-400',
              },
              {
                label: 'Total Assigned',
                value: stats.reduce((a, b) => a + b.totalAssigned, 0),
                icon: BarChart3,
                color: 'text-blue-400',
              },
              {
                label: 'Total Resolved',
                value: stats.reduce((a, b) => a + b.resolved + b.closed, 0),
                icon: CheckCircle2,
                color: 'text-emerald-400',
              },
              {
                label: 'Avg Resolution Rate',
                value: stats.length
                  ? Math.round(stats.reduce((a, b) => a + b.resolutionRate, 0) / stats.length) + '%'
                  : '0%',
                icon: TrendingUp,
                color: 'text-amber-400',
              },
            ].map((card, i) => (
              <div
                key={card.label}
                className="glass rounded-xl border border-white/5 p-5"
                style={{ animation: 'slideUp 0.35s ease both', animationDelay: `${i * 60}ms` }}
              >
                <card.icon size={18} className={cn('mb-3', card.color)} />
                <p className="font-display text-2xl font-700 text-white">{card.value}</p>
                <p className="text-white/35 text-xs mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Top performer banner */}
          {topVendor && topVendor.resolutionRate > 0 && (
            <div className="glass rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 mb-6 flex items-center gap-3">
              <Award size={18} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-amber-300 text-sm font-medium">
                  Top Performer — {topVendor.vendorName}
                </p>
                <p className="text-white/40 text-xs">
                  {topVendor.resolutionRate}% resolution rate ·{' '}
                  {topVendor.resolved + topVendor.closed} tickets resolved
                </p>
              </div>
            </div>
          )}

          {/* Vendor cards */}
          <div className="space-y-4">
            {stats
              .sort((a, b) => b.resolutionRate - a.resolutionRate)
              .map((vendor, index) => (
                <div
                  key={vendor.vendorId}
                  className="glass rounded-2xl border border-white/5 p-5 card-hover"
                  style={{ animation: 'slideUp 0.35s ease both', animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Vendor info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-display font-700 text-indigo-300">
                        {vendor.vendorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">
                            {vendor.vendorName}
                          </p>
                          {topVendor?.vendorId === vendor.vendorId && (
                            <Award size={13} className="text-amber-400" />
                          )}
                        </div>
                        <p className="text-white/35 text-xs font-mono">
                          {vendor.vendorEmail}
                        </p>
                      </div>
                    </div>

                    {/* Resolution rate */}
                    <div className="text-right flex-shrink-0">
                      <p className={cn('font-display text-2xl font-700', getRateColor(vendor.resolutionRate))}>
                        {vendor.resolutionRate}%
                      </p>
                      <p className="text-white/30 text-xs">resolution rate</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                    <div
                      className={cn('h-1.5 rounded-full bg-gradient-to-r transition-all duration-1000', getRateBarColor(vendor.resolutionRate))}
                      style={{ width: `${vendor.resolutionRate}%` }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: 'Assigned', value: vendor.totalAssigned, color: 'text-white/60' },
                      { label: 'In Progress', value: vendor.inProgress, color: 'text-amber-400' },
                      { label: 'Resolved', value: vendor.resolved, color: 'text-emerald-400' },
                      { label: 'Closed', value: vendor.closed, color: 'text-zinc-400' },
                      { label: 'Avg Time', value: vendor.avgResolutionTime, color: 'text-indigo-400' },
                    ].map(stat => (
                      <div
                        key={stat.label}
                        className="bg-white/[0.03] rounded-xl px-3 py-2.5 text-center"
                      >
                        <p className={cn('font-display font-700 text-lg', stat.color)}>
                          {stat.value}
                        </p>
                        <p className="text-white/25 text-xs mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Warning if no tickets */}
                  {vendor.totalAssigned === 0 && (
                    <div className="flex items-center gap-2 mt-3 text-white/25 text-xs">
                      <AlertCircle size={12} />
                      No tickets assigned yet
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}