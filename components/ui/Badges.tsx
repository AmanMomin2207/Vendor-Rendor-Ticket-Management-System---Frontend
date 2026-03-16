import { cn, getPriorityColor, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Priority, TicketStatus } from '@/types'

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn('badge', getPriorityColor(priority))}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  )
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn('badge', getStatusColor(status))}>
      {getStatusLabel(status)}
    </span>
  )
}
