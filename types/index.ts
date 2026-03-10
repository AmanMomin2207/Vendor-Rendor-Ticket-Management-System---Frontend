export type Role = 'BUYER' | 'VENDOR' | 'ADMIN'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  priority: Priority
  status: TicketStatus
  createdBy: string
  assignedTo: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
  resolutionNote: string | null
}

export interface DashboardResponse {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface TicketHistory {
  id: string
  ticketId: string
  oldStatus: TicketStatus
  newStatus: TicketStatus
  changedBy: string
  changedAt: string
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  authorRole: Role
  message: string
  createdAt: string
}

export interface VendorStats {
  vendorId: string
  vendorName: string
  vendorEmail: string
  totalAssigned: number
  inProgress: number
  resolved: number
  closed: number
  resolutionRate: number
  avgResolutionTime: string
}

