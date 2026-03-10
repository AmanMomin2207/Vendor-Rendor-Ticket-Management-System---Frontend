'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Ticket } from 'lucide-react'
import TicketTable from '@/components/tickets/TicketTable'
import { getRole } from '@/lib/auth'
import { Role } from '@/types'

export default function TicketsPage() {
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    setRole(getRole())
  }, [])

  const pageTitle: Record<Role, string> = {
    ADMIN: 'All Tickets',
    BUYER: 'My Tickets',
    VENDOR: 'Assigned Tickets',
  }

  const pageDesc: Record<Role, string> = {
    ADMIN: 'Manage, assign, and export all tickets',
    BUYER: 'View and manage your submitted tickets',
    VENDOR: 'Browse and update your assigned tickets',
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
            <Ticket size={12} />
            <span>Tickets</span>
          </div>
          <h1 className="font-display text-2xl font-700 text-white">
            {role ? pageTitle[role] : 'Tickets'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {role ? pageDesc[role] : ''}
          </p>
        </div>

        {role === 'BUYER' && (
          <Link
            href="/tickets/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-glow"
          >
            <PlusCircle size={15} />
            New Ticket
          </Link>
        )}
      </div>

      {role && <TicketTable role={role} />}
    </div>
  )
}
