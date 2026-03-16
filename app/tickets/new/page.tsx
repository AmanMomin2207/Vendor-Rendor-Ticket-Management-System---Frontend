import CreateTicketForm from '@/components/tickets/CreateTicketForm'
import { PlusCircle } from 'lucide-react'

export default function NewTicketPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
        <PlusCircle size={12} />
        <span>New Ticket</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-white mb-1">Create Ticket</h1>
      <p className="text-white/40 text-sm mb-8">Submit a new support request</p>
      <CreateTicketForm />
    </div>
  )
}
