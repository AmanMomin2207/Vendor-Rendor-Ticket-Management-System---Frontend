'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Ticket, LayoutDashboard, PlusCircle, LogOut,
  Users, UserCircle , Settings, ChevronRight, Menu, X,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'
import { logout, getRole } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Role } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: Record<Role, NavItem[]> = {
  BUYER: [
    { href: '/dashboard/buyer', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tickets', label: 'My Tickets', icon: Ticket },
    { href: '/tickets/new', label: 'New Ticket', icon: PlusCircle },
  ],
  VENDOR: [
    { href: '/dashboard/vendor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tickets', label: 'Assigned Tickets', icon: Ticket },
  ],
  ADMIN: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tickets', label: 'All Tickets', icon: Ticket },
    { href: '/users', label: 'Users', icon: Users }, 
    { href: '/vendors', label: 'Vendor Stats', icon: BarChart3 },
  ],
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const role = getRole()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = role ? navItems[role] : []

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const roleBadgeColor: Record<Role, string> = {
    ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    BUYER: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    VENDOR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Ticket size={16} className="text-indigo-400" />
        </div>
        <div>
          <p className="font-display font-700 text-sm text-white leading-none">TicketFlow</p>
          <p className="text-white/30 text-xs mt-0.5">Management</p>
        </div>
      </div>

      {/* Role badge */}
      {role && (
        <div className="px-4 py-3 border-b border-white/5">
          <span className={cn('badge', roleBadgeColor[role])}>
            {role}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard/buyer' &&
             item.href !== '/dashboard/admin' &&
             item.href !== '/dashboard/vendor' &&
             pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn('nav-item', isActive && 'active')}
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-40" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: logout and Profile */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className={cn('nav-item', pathname === '/profile' && 'active')}
        >
          <UserCircle size={16} />
          <span className="flex-1">Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-400/5"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 bg-surface-1 border-r border-white/5 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-0/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Ticket size={14} className="text-indigo-400" />
          </div>
          <span className="font-display font-700 text-sm text-white">TicketFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/50 hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 bg-surface-1 border-r border-white/5 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
