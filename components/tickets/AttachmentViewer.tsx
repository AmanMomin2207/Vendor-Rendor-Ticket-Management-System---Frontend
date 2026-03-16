'use client'
import { useState } from 'react'
import { ticketApi } from '@/lib/api'
import { Ticket } from '@/types'
import { Paperclip, Download, FileText, Image, File, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function getFileIcon(type: string | null) {
  if (!type) return <File size={16} className="text-white/40" />
  if (type.startsWith('image/')) return <Image size={16} className="text-blue-400" />
  if (type === 'application/pdf') return <FileText size={16} className="text-red-400" />
  return <File size={16} className="text-indigo-400" />
}

function formatSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AttachmentViewer({ ticket }: { ticket: Ticket }) {
  const [downloading, setDownloading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // No attachment
  if (!ticket.fileId) {
    return (
      <div className="flex items-center gap-2 text-white/20 text-sm py-1">
        <Paperclip size={14} />
        No attachment
      </div>
    )
  }

  const isImage = ticket.attachmentType?.startsWith('image/')
  const isPdf   = ticket.attachmentType === 'application/pdf'
  const canPreview = isImage || isPdf

  const fetchBlob = async () => {
    const res = await ticketApi.downloadAttachment(ticket.id)
    return new Blob([res.data], {
      type: ticket.attachmentType || 'application/octet-stream'
    })
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await fetchBlob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = ticket.attachmentName || 'attachment'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Downloaded!')
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handlePreview = async () => {
    if (previewUrl) {
      setPreviewUrl(null)   // toggle off
      return
    }
    setDownloading(true)
    try {
      const blob = await fetchBlob()
      setPreviewUrl(window.URL.createObjectURL(blob))
    } catch {
      toast.error('Preview failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* File card */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02]">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          {getFileIcon(ticket.attachmentType ?? null)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm font-medium truncate">
            {ticket.attachmentName}
          </p>
          <p className="text-white/30 text-xs mt-0.5">
            {formatSize(ticket.attachmentSize ?? null)}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {canPreview && (
            <button
              onClick={handlePreview}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-xs transition-all"
            >
              {previewUrl ? 'Close' : 'Preview'}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs transition-all disabled:opacity-60"
          >
            {downloading
              ? <Loader2 size={12} className="animate-spin" />
              : <Download size={12} />}
            Download
          </button>
        </div>
      </div>

      {/* Inline preview */}
      {previewUrl && (
        <div className="rounded-xl border border-white/8 overflow-hidden">
          {isImage ? (
            <img
              src={previewUrl}
              alt={ticket.attachmentName ?? ''}
              className="w-full max-h-96 object-contain bg-black/30"
            />
          ) : isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-96"
              title={ticket.attachmentName ?? 'PDF'}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}