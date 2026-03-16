'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Ticket, ArrowRight, Loader2, ChevronDown } from 'lucide-react'
import { authApi } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      toast.success('Account created! Please sign in.')
      router.push('/login')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'BUYER', label: 'Buyer', desc: 'Raise and track support tickets' },
    { value: 'VENDOR', label: 'Vendor', desc: 'Resolve assigned tickets' },
    { value: 'ADMIN', label: 'Admin', desc: 'Manage all tickets and users' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md page-enter">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Ticket size={16} className="text-indigo-400" />
          </div>
          <span className="font-display font-700 text-base text-white">TicketFlow</span>
        </div>

        <h2 className="font-display text-2xl font-700 text-white mb-1">Create account</h2>
        <p className="text-white/40 text-sm mb-8">Get started with TicketFlow today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-ring w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-ring w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-ring w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                    form.role === r.value
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                      : 'border-white/8 bg-white/[0.02] text-white/50 hover:border-white/15'
                  }`}
                >
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-xs mt-0.5 opacity-60">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-150 shadow-glow"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>Create account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
