'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft } from 'lucide-react'
import { ticketApi } from '@/lib/api'
import { Priority } from '@/types'

export default function CreateTicketForm() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM' as Priority })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await ticketApi.createTicket(form)
      toast.success('Ticket created successfully!')
      router.push('/tickets')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  const priorities: { value: Priority; label: string; color: string; desc: string }[] = [
    { value: 'LOW', label: 'Low', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400', desc: 'Non-urgent issue' },
    { value: 'MEDIUM', label: 'Medium', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400', desc: 'Needs attention' },
    { value: 'HIGH', label: 'High', color: 'border-red-500/50 bg-red-500/10 text-red-400', desc: 'Urgent problem' },
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors mb-8"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Brief description of the issue"
            className="input-ring w-full"
            maxLength={120}
          />
          <p className="text-white/20 text-xs mt-1">{form.title.length}/120</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide detailed information about the issue..."
            rows={5}
            className="input-ring w-full resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-3">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setForm({ ...form, priority: p.value })}
                className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                  form.priority === p.value
                    ? p.color
                    : 'border-white/8 bg-white/[0.02] text-white/50 hover:border-white/15 hover:bg-white/5'
                }`}
              >
                <div className="font-medium text-sm">{p.label}</div>
                <div className="text-xs mt-0.5 opacity-70">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </form>
  )
}
