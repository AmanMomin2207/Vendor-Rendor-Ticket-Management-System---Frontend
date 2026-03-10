'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, User, Mail, Lock, Save, ArrowLeft } from 'lucide-react'
import { profileApi } from '@/lib/api'

interface Profile {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    profileApi.get()
      .then(res => {
        const data = res.data.data
        setProfile(data)
        setForm({ name: data.name, email: data.email, password: '' })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: any = {}
      if (form.name !== profile?.name) payload.name = form.name
      if (form.email !== profile?.email) payload.email = form.email
      if (form.password) payload.password = form.password

      if (Object.keys(payload).length === 0) {
        toast('No changes to save')
        return
      }

      const res = await profileApi.update(payload)
      setProfile(res.data.data)
      setForm(f => ({ ...f, password: '' }))
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const roleBadge: Record<string, string> = {
    ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    BUYER: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    VENDOR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={22} className="animate-spin text-indigo-400" />
    </div>
  )

  return (
    <div className="max-w-xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Profile header */}
      <div className="glass rounded-2xl border border-white/5 p-6 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-display font-700 text-indigo-300">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-display text-lg font-700 text-white">{profile?.name}</h2>
          <p className="text-white/40 text-sm">{profile?.email}</p>
          <span className={`badge mt-1.5 ${roleBadge[profile?.role ?? '']}`}>
            {profile?.role}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass rounded-2xl border border-white/5 p-6">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-5">Edit Profile</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-ring w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-ring w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-ring w-full pl-9"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="glass rounded-2xl border border-white/5 p-5 mt-4">
        <p className="text-white/25 text-xs uppercase tracking-wider mb-3">Account Info</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/30">User ID</span>
            <span className="text-white/40 font-mono">{profile?.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/30">Status</span>
            <span className={profile?.isActive ? 'text-emerald-400' : 'text-red-400'}>
              {profile?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/30">Member since</span>
            <span className="text-white/40">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}   