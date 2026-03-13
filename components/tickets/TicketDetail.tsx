'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, User, Calendar, Tag, Activity, History, CheckCircle2 , Paperclip } from 'lucide-react'
import { Ticket, Role, TicketStatus } from '@/types'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import TicketTimeline from '@/components/tickets/TicketTimeline'
import TicketComments from '@/components/tickets/TicketComments'
import { MessageSquare } from 'lucide-react'
import { ticketApi, commentApi, userApi } from '@/lib/api'
import AttachmentViewer from '@/components/tickets/AttachmentViewer'

interface TicketDetailProps {
  id: string
  role: Role
}

const VENDOR_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: [],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CLOSED: [],
}

export default function TicketDetail({ id, role }: TicketDetailProps) {
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [resolveModalOpen, setResolveModalOpen] = useState(false)
  const [resolutionNote, setResolutionNote] = useState('')
  const [vendors, setVendors] = useState<{ id: string; name: string; email: string }[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(false)

  // Admin: assign modal
  const [assignOpen, setAssignOpen] = useState(false)
  const [vendorId, setVendorId] = useState('')

  const fetchTicket = async () => {
    try {
      let res
      if (role === 'ADMIN') {
        res = await ticketApi.getTicketById(id)        // existing admin endpoint
      } else {
        // For buyer/vendor, fetch from the list and find the ticket
        res = await ticketApi.getTickets({ page: 0, size: 100 })
        const found = res.data.data.content.find((t: Ticket) => t.id === id)
        if (!found) throw new Error('Not found')
        setTicket(found)
        setLoading(false)
        return
      }
      setTicket(res.data.data)
    } catch {
      toast.error('Failed to load ticket')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTicket() }, [id])

  const openAssignModal = async () => {
    setAssignOpen(true)
    setVendorsLoading(true)
    try {
      const res = await userApi.getAll()
      const allUsers = res.data.data
      const vendorUsers = allUsers.filter((u: any) => u.role === 'VENDOR' && u.isActive)
      setVendors(vendorUsers.map((u: any) => ({ id: u.id, name: u.name, email: u.email })))
    } catch {
      toast.error('Failed to load vendors')
    } finally {
      setVendorsLoading(false)
    }
  }

  const handleAssign = async () => {
    console.log('=== ASSIGN DEBUG ===')
    console.log('vendorId:', vendorId)
    console.log('ticketId:', id)  
    console.log('ticket.status:', ticket?.status)
    console.log('role:', role)
    
    if (!vendorId.trim()) { toast.error('Enter a vendor ID'); return }
    
    setActionLoading(true)
    try {
      const res = await ticketApi.assignTicket(id, vendorId)
      console.log('Success:', res.data)
      setTicket(res.data.data)
      setAssignOpen(false)
      setVendorId('')          // ✅ clear after success
      toast.success('Ticket assigned!')
    } catch (err: any) {
      console.error('Full error:', err.response)   // 👈 this shows exact backend message
      toast.error(err.response?.data?.message || err.message || 'Assignment failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatusUpdate = async (status: TicketStatus) => {
    // if moving to RESOLVED, open modal first
    if (status === 'RESOLVED') {
      setResolveModalOpen(true)
      return
    }
    setActionLoading(true)
    try {
      const res = await ticketApi.updateStatus(id, status)
      setTicket(res.data.data)
      toast.success(`Status updated to ${status.replace('_', ' ')}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async () => {
    setActionLoading(true)
    try {
      const res = await ticketApi.updateStatus(id, 'RESOLVED', resolutionNote)
      setTicket(res.data.data)
      setResolveModalOpen(false)
      setResolutionNote('')
      toast.success('Ticket marked as resolved!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleClose = async () => {
    setActionLoading(true)
    try {
      const res = await ticketApi.closeTicket(id)
      setTicket(res.data.data)
      toast.success('Ticket closed!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Close failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!ticket) return null

  const availableTransitions = VENDOR_TRANSITIONS[ticket.status] || []

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to tickets
      </button>

      {/* Header */}
      <div className="glass rounded-2xl border border-white/5 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="font-display text-xl font-700 text-white leading-tight flex-1">
            {ticket.title}
          </h1>
          <div className="flex gap-2 flex-shrink-0">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">{ticket.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/5">
          {[
            { icon: User, label: 'Created by', value: ticket.createdBy?.slice(-8) || '—' },
            { icon: Tag, label: 'Assigned to', value: ticket.assignedTo?.slice(-8) || 'Unassigned' },
            { icon: Calendar, label: 'Created', value: formatDate(ticket.createdAt) },
            { icon: Activity, label: 'Updated', value: formatDate(ticket.updatedAt) },
          ].map((meta) => (
            <div key={meta.label}>
              <div className="flex items-center gap-1.5 text-white/30 text-xs mb-1">
                <meta.icon size={11} />
                {meta.label}
              </div>
              <p className="text-white/70 text-xs font-mono">{meta.value}</p>
            </div>
          ))}
        </div>

        {ticket.resolvedAt && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Resolved at {formatDate(ticket.resolvedAt)}
          </div>
        )}
        {ticket.closedAt && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400/70">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Closed at {formatDate(ticket.closedAt)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="glass rounded-2xl border border-white/5 p-5">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Actions</p>

        <div className="flex flex-wrap gap-2">
          {role === 'ADMIN' && ticket.status === 'OPEN' && (
            <button
              onClick={openAssignModal}   
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all"
            >
              Assign to Vendor
            </button>
          )}

          {/* Vendor: status transitions */}
          {role === 'VENDOR' && availableTransitions.map((nextStatus) => (
            <button
              key={nextStatus}
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-60"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Move to {nextStatus.replace('_', ' ')}
            </button>
          ))}

          {/* Buyer: close */}
          {role === 'BUYER' && ticket.status === 'RESOLVED' && (
            <button
              onClick={handleClose}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all disabled:opacity-60"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Close Ticket
            </button>
          )}

          {( ticket.status as string) === 'CLOSED' || 
            (role === 'VENDOR' && availableTransitions.length === 0 && ticket.status !== 'CLOSED') ||
            (role === 'BUYER' && ticket.status !== 'RESOLVED') ||
            (role === 'ADMIN' && ticket.status !== 'OPEN') && (
            <p className="text-white/25 text-sm py-2">
              No actions available for current status.
            </p>
          )}
        </div>
      </div>
      
      {/* Attachment */}
      <div className="glass rounded-2xl border border-white/5 p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Paperclip size={14} className="text-white/30" />
          <p className="text-white/30 text-xs uppercase tracking-wider">Attachment</p>
        </div>
        <AttachmentViewer ticket={ticket} />    {/* ✅ pass ticket not just id */}
      </div>

      <div className="glass rounded-2xl border border-white/5 p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <History size={14} className="text-white/30" />
          <p className="text-white/30 text-xs uppercase tracking-wider">Status History</p>
        </div>
        <TicketTimeline ticketId={id} />
      </div>

      <div className="glass rounded-2xl border border-white/5 p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={14} className="text-white/30" />
          <p className="text-white/30 text-xs uppercase tracking-wider">Comments</p>
        </div>
        <TicketComments ticketId={id} currentRole={role} />
      </div>

      {/* Assign modal */}
      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Ticket to Vendor">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Select Vendor
            </label>

            {vendorsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={18} className="animate-spin text-indigo-400" />
              </div>
            ) : vendors.length === 0 ? (
              <p className="text-white/30 text-sm py-3">No active vendors found.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {vendors.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVendorId(v.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      vendorId === v.id
                        ? 'border-indigo-500/60 bg-indigo-500/10'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-display font-700 text-emerald-300 flex-shrink-0">
                      {v.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">{v.name}</p>
                      <p className="text-white/35 text-xs font-mono truncate">{v.email}</p>
                    </div>
                    {/* Selected indicator */}
                    {vendorId === v.id && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => { setAssignOpen(false); setVendorId('') }}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={actionLoading || !vendorId}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Assign
            </button>
          </div>
        </div>
      </Modal>

      {/* Resolution note display — shown to everyone if present */}
      {ticket.resolutionNote && (
        <div className="glass rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <p className="text-emerald-400/80 text-xs uppercase tracking-wider font-medium">
              Resolution Note
            </p>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {ticket.resolutionNote}
          </p>
        </div>
      )}

      {/* Resolve modal */}
      <Modal
        open={resolveModalOpen}
        onClose={() => { setResolveModalOpen(false); setResolutionNote('') }}
        title="Resolve Ticket"
      >
        <div className="space-y-4">
          <p className="text-white/50 text-sm">
            Describe what you did to resolve this issue. This note will be visible to the buyer and admin.
          </p>
          <div>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
              Resolution Note <span className="text-white/25">(optional)</span>
            </label>
            <textarea
              value={resolutionNote}
              onChange={e => setResolutionNote(e.target.value)}
              placeholder="e.g. Replaced faulty component, restarted the service, updated configuration..."
              rows={4}
              className="input-ring w-full resize-none text-sm"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setResolveModalOpen(false); setResolutionNote('') }}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all disabled:opacity-60"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Mark as Resolved
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
