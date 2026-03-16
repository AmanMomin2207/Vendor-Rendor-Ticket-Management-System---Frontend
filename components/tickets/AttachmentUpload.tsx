'use client'
import { useRef, useState } from 'react'
import { Paperclip, X, FileText, Image, File } from 'lucide-react'

interface AttachmentUploadProps {
  onAttach: (file: File) => void   // ✅ now passes File directly
  onClear: () => void
  attached: File | null
}

const MAX_SIZE_MB = 5

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image size={16} className="text-blue-400" />
  if (type === 'application/pdf') return <FileText size={16} className="text-red-400" />
  return <File size={16} className="text-white/50" />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AttachmentUpload({
  onAttach, onClear, attached
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB}MB allowed.`)
      return
    }

    onAttach(file)   // ✅ pass raw File object — no Base64 conversion
    e.target.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
        Attachment{' '}
        <span className="text-white/25 normal-case">(optional — max 5MB)</span>
      </label>

      {!attached ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5 text-white/40 hover:text-white/70 text-sm transition-all w-full"
        >
          <Paperclip size={15} />
          Click to attach a file
          <span className="ml-auto text-xs text-white/20">
            PDF, DOC, XLS, PNG, JPG, ZIP...
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/8">
          {getFileIcon(attached.type)}
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm truncate">{attached.name}</p>
            <p className="text-white/30 text-xs mt-0.5">
              {formatSize(attached.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClear()
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="text-white/30 hover:text-red-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt,.csv,.zip"
        onChange={handleFile}
      />
    </div>
  )
}