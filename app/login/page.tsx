'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Ticket, ArrowRight, Loader2 } from 'lucide-react'
import { authApi } from '@/lib/api'
import { setAuth, getRole, getDashboardPath } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const token = res.data
      setAuth(token)
      const role = getRole()
      toast.success('Welcome back!')
      setTimeout(() => {
        router.push(getDashboardPath(role!))
      }, 300)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-surface-1">
        {/* Decorative glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Ticket size={18} className="text-indigo-400" />
          </div>
          <span className="font-display font-700 text-lg text-white">TicketFlow</span>
        </div>

        <div className="z-10">
          <h1 className="font-display text-4xl font-800 text-white leading-tight mb-4">
            Streamline your<br />
            <span className="gradient-text">support workflow</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            A unified platform for buyers to raise issues, vendors to resolve them,
            and admins to keep everything running smoothly.
          </p>

          {/* Feature highlights */}
          <div className="space-y-3">
            {[
              { dot: 'bg-emerald-400', text: 'Real-time ticket tracking' },
              { dot: 'bg-indigo-400', text: 'Role-based access control' },
              { dot: 'bg-amber-400', text: 'Priority & status management' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span className="text-white/60 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs z-10">© 2026 TicketFlow. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md page-enter">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Ticket size={16} className="text-indigo-400" />
            </div>
            <span className="font-display font-700 text-base text-white">TicketFlow</span>
          </div>

          <h2 className="font-display text-2xl font-700 text-white mb-1">Sign in</h2>
          <p className="text-white/40 text-sm mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-ring w-full pr-10"
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-150 shadow-glow"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-white/40 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Register
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-white/30 text-xs font-medium mb-2 uppercase tracking-wider">Demo credentials</p>
            <div className="space-y-1">
              {[
                { role: 'Admin', email: 'admin@test.com' },
                { role: 'Buyer', email: 'buyer@test.com' },
                { role: 'Vendor', email: 'vendor@test.com' },
              ].map((d) => (
                <div key={d.role} className="flex items-center justify-between text-xs">
                  <span className="text-white/40">{d.role}:</span>
                  <span className="text-white/30 font-mono">{d.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
