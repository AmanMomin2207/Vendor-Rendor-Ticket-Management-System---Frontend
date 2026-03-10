import Cookies from 'js-cookie'
import { parseJwt } from './api'
import { Role } from '@/types'

export function setAuth(token: string) {
  const payload = parseJwt(token)
  Cookies.set('token', token, { expires: 1 })
  if (payload?.role) {
    Cookies.set('role', payload.role, { expires: 1 })
  }
}

export function getRole(): Role | null {
  return (Cookies.get('role') as Role) || null
}

export function getToken(): string | null {
  return Cookies.get('token') || null
}

export function logout() {
  Cookies.remove('token')
  Cookies.remove('role')
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case 'ADMIN': return '/dashboard/admin'
    case 'BUYER': return '/dashboard/buyer'
    case 'VENDOR': return '/dashboard/vendor'
    default: return '/login'
  }
}
