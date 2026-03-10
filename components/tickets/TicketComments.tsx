'use client'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Send, Trash2, MessageSquare } from 'lucide-react'
import { commentApi } from '@/lib/api'
import { Comment, Role } from '@/types'
import { formatDate, cn } from '@/lib/utils'
import Cookies from 'js-cookie'

interface TicketCommentsProps {
  ticketId: string
  currentRole: Role
}

const roleColor: Record<Role, string> = {
  ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  BUYER: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  VENDOR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

export default function TicketComments({ ticketId, currentRole }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchComments = async () => {
    try {
      const res = await commentApi.getComments(ticketId)
      setComments(res.data.data)
    } catch {
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments() }, [ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      const res = await commentApi.addComment(ticketId, message.trim())
      setComments(prev => [...prev, res.data.data])
      setMessage('')
    } catch {
      toast.error('Failed to send comment')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId)
    try {
      await commentApi.deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Comments list */}
      <div className="max-h-80 overflow-y-auto space-y-3 mb-4 pr-1">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={18} className="animate-spin text-indigo-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/25">
            <MessageSquare size={20} className="mb-2" />
            <p className="text-sm">No comments yet. Start the conversation.</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="group flex gap-3 items-start"
              style={{ animation: 'slideUp 0.3s ease both', animationDelay: `${index * 40}ms` }}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-display font-700 text-white/60 flex-shrink-0">
                {comment.authorName?.charAt(0).toUpperCase()}
              </div>

              {/* Bubble */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/70 text-xs font-medium">
                    {comment.authorName}
                  </span>
                  <span className={cn('badge text-xs py-0', roleColor[comment.authorRole])}>
                    {comment.authorRole}
                  </span>
                  <span className="text-white/25 text-xs ml-auto">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="glass rounded-xl rounded-tl-sm px-3 py-2.5 border border-white/5">
                  <p className="text-white/80 text-sm leading-relaxed break-words">
                    {comment.message}
                  </p>
                </div>
              </div>

              {/* Delete button — visible on hover for author or admin */}
              {(currentRole === 'ADMIN') && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="opacity-0 group-hover:opacity-100 mt-6 p-1.5 rounded-lg text-white/20 hover:text-red-400 transition-all"
                >
                  {deletingId === comment.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                </button>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 items-end">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend(e as any)
            }
          }}
          placeholder="Write a comment... (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="input-ring flex-1 resize-none text-sm"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="flex-shrink-0 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending
            ? <Loader2 size={16} className="animate-spin" />
            : <Send size={16} />}
        </button>
      </form>
      <p className="text-white/20 text-xs mt-1.5">Press Enter to send · Shift+Enter for new line</p>
    </div>
  )
}