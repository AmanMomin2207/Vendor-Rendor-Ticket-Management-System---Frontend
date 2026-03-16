'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ticketApi } from '@/lib/api'
import AttachmentUpload from './AttachmentUpload'
import toast from 'react-hot-toast'
import { Loader2, Send } from 'lucide-react'

export default function CreateTicketForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  })

  // ✅ No <form> tag — use button onClick instead
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('priority', form.priority)
      if (attachedFile) {
        formData.append('file', attachedFile)
      }

      await ticketApi.createTicket(formData)
      toast.success('Ticket created successfully!')
      router.push('/tickets')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Brief description of the issue..."
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Detailed explanation of the issue..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm resize-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
          Priority
        </label>
        <div className="flex gap-3">
          {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setForm(f => ({ ...f, priority: p }))}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                form.priority === p
                  ? p === 'HIGH'
                    ? 'border-red-500/60 bg-red-500/10 text-red-300'
                    : p === 'MEDIUM'
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                  : 'border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Attachment */}
      <AttachmentUpload
        attached={attachedFile}
        onAttach={file => setAttachedFile(file)}
        onClear={() => setAttachedFile(null)}
      />

      {/* Submit — type="button" is critical */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !form.title.trim() || !form.description.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Creating...</>
          : <><Send size={16} /> Create Ticket</>
        }
      </button>

    </div>
  )
}