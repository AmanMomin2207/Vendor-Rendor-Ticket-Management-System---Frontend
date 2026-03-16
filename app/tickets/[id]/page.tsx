'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TicketDetail from '@/components/tickets/TicketDetail'
import { getRole } from '@/lib/auth'
import { Role } from '@/types'
import { Loader2 } from 'lucide-react'

export default function TicketDetailPage() {
  const params = useParams()
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    setRole(getRole())
  }, [])

  const id = params?.id as string

  if (!role) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-indigo-400" />
      </div>
    )
  }

  return <TicketDetail id={id} role={role} />
}
