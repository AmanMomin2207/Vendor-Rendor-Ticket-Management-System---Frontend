'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Users, Loader2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { userApi } from '@/lib/api'
import { User } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAll()
      setUsers(res.data.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggle = async (id: string) => {
    setActionId(id)
    try {
      const res = await userApi.toggleStatus(id)
      setUsers(prev => prev.map(u => u.id === id ? res.data.data : u))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setActionId(id)
    try {
      await userApi.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setActionId(null)
    }
  }

  const roleBadge: Record<string, string> = {
    ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    BUYER: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    VENDOR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
        <Users size={12} /> Users
      </div>
      <h1 className="font-display text-2xl font-700 text-white mb-1">User Management</h1>
      <p className="text-white/40 text-sm mb-6">Manage all registered users</p>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={22} className="animate-spin text-indigo-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/[0.03] table-row-hover">
                  <td className="px-4 py-3.5 text-white/90 font-medium">{user.name}</td>
                  <td className="px-4 py-3.5 text-white/50 font-mono text-xs">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`badge ${roleBadge[user.role] ?? ''}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`badge ${user.isActive
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                      : 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(user.id)}
                        disabled={actionId === user.id}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white border border-white/8 hover:border-white/20 transition-all disabled:opacity-40"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {actionId === user.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : user.isActive
                            ? <ToggleRight size={14} className="text-emerald-400" />
                            : <ToggleLeft size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={actionId === user.id}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 border border-white/8 hover:border-red-400/30 transition-all disabled:opacity-40"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}