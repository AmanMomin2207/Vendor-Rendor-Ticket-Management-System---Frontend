'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, Download, RefreshCw } from 'lucide-react'
import { ticketApi } from '@/lib/api'
import { Ticket, TicketStatus, Priority, PagedResponse, Role } from '@/types'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badges'
import { formatDate, cn } from '@/lib/utils'
import { TableSkeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

interface TicketTableProps {
  role: Role
}

const STATUS_OPTIONS: TicketStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH']

export default function TicketTable({ role }: TicketTableProps) {
  const router = useRouter()
  const [data, setData] = useState<PagedResponse<Ticket> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<TicketStatus | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc')

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ticketApi.getTickets({
        page,
        size: 8,
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined,
        sortBy,
        direction,
      })
      setData(res.data.data)
    } catch (err) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [page, status, priority, search, sortBy, direction])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(0)
  }

  const handleExport = async () => {
    try {
      const res = await ticketApi.exportCSV()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'tickets.csv'
      a.click()
      toast.success('CSV exported!')
    } catch {
      toast.error('Export failed')
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setDirection('desc')
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tickets..."
            className="input-ring w-full pl-8 py-2 text-xs"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as any); setPage(0) }}
            className="input-ring text-xs py-2 cursor-pointer"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>

          {/* Priority filter */}
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value as any); setPage(0) }}
            className="input-ring text-xs py-2 cursor-pointer"
          >
            <option value="">All Priority</option>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchTickets}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
          </button>

          {/* Export (admin only) */}
          {role === 'ADMIN' && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={6} />
          </div>
        ) : !data?.content.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <Filter size={20} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">No tickets found</p>
            {(status || priority || search) && (
              <button
                onClick={() => { setStatus(''); setPriority(''); setSearch(''); setSearchInput('') }}
                className="text-indigo-400 text-xs mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { label: 'Title', field: 'title' },
                  { label: 'Priority', field: 'priority' },
                  { label: 'Status', field: 'status' },
                  { label: 'Created', field: 'createdAt' },
                  { label: '', field: '' },
                ].map((col) => (
                  <th
                    key={col.label}
                    className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                  >
                    {col.field ? (
                      <button
                        onClick={() => col.field && toggleSort(col.field)}
                        className="flex items-center gap-1 hover:text-white/60 transition-colors"
                      >
                        {col.label}
                        {col.field && <ArrowUpDown size={11} />}
                      </button>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.content.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-white/[0.03] table-row-hover cursor-pointer transition-colors"
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                >
                  <td className="px-4 py-3.5">
                    <p className="text-white/90 font-medium truncate max-w-[240px]">{ticket.title}</p>
                    <p className="text-white/30 text-xs mt-0.5 truncate max-w-[240px]">{ticket.description}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3.5 text-white/30 text-xs whitespace-nowrap">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-indigo-400/60 text-xs hover:text-indigo-400 transition-colors">
                      View →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {data.totalElements} tickets · Page {page + 1} of {data.totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed border border-white/8 hover:border-white/20 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
              const pageNum = Math.max(0, Math.min(page - 2, data.totalPages - 5)) + i
              if (pageNum >= data.totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs transition-all',
                    pageNum === page
                      ? 'bg-indigo-600 text-white'
                      : 'text-white/40 hover:text-white border border-white/8 hover:border-white/20'
                  )}
                >
                  {pageNum + 1}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={data.last}
              className="p-1.5 rounded-lg text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed border border-white/8 hover:border-white/20 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
