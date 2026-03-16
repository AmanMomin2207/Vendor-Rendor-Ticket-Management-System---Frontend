import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Priority, TicketStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getPriorityColor(priority: Priority) {
  switch (priority) {
    case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  }
}

export function getStatusColor(status: TicketStatus) {
  switch (status) {
    case 'OPEN': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'ASSIGNED': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    case 'IN_PROGRESS': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'RESOLVED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'CLOSED': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
  }
}

export function getStatusLabel(status: TicketStatus) {
  switch (status) {
    case 'IN_PROGRESS': return 'In Progress'
    default: return status.charAt(0) + status.slice(1).toLowerCase()
  }
}
