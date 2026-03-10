import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = 'https://vendor-rendor-ticket-management-system-qir0.onrender.com'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      Cookies.remove('token')
      Cookies.remove('role')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<string>('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<string>('/api/auth/login', data),
}

// ─── Tickets ─────────────────────────────────────────────
export const ticketApi = {
  getTickets: (params: {
    page?: number
    size?: number
    status?: string
    priority?: string
    search?: string
    sortBy?: string
    direction?: string
  }) => api.get('/api/tickets', { params }),

  getTicketById: (id: string) => api.get(`/api/tickets/${id}`),

  createTicket: (data: { title: string; description: string; priority: string }) =>
    api.post('/api/tickets/create', data),

  assignTicket: (id: string, vendorId: string) =>
    api.put(`/api/tickets/${id}/assign`, { vendorId }),

  updateStatus: (id: string, status: string, resolutionNote?: string) =>
    api.put(`/api/tickets/${id}/status`, { status, resolutionNote }),

  closeTicket: (id: string) => api.put(`/api/tickets/${id}/close`),

  exportCSV: () =>
    api.get('/api/tickets/export', { responseType: 'blob' }),

  getHistory: (id: string) => api.get(`/api/tickets/${id}/history`),
}

// ─── Dashboard ───────────────────────────────────────────
export const dashboardApi = {
  buyer: () => api.get('/api/dashboard/buyer'),
  admin: () => api.get('/api/dashboard/admin'),
  vendor: () => api.get('/api/dashboard/vendor'),
}

// ─── Users ───────────────────────────────────────────────
// export const userApi = {
//   getAll: () => api.get('/api/admin/users'),
// }

export const userApi = {
  getAll: () => api.get('/api/admin/users'),
  toggleStatus: (id: string) => api.put(`/api/admin/users/${id}/toggle`),
  deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`),
}


// ─── JWT decode (client-side) ────────────────────────────
export function parseJwt(token: string) {
  try {
    const base64 = token.split('.')[1]
    const decoded = JSON.parse(atob(base64))
    return decoded
  } catch {
    return null
  }
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/api/profile', data),
}

export const commentApi = {
  getComments: (ticketId: string) =>
    api.get(`/api/tickets/${ticketId}/comments`),

  addComment: (ticketId: string, message: string) =>
    api.post(`/api/tickets/${ticketId}/comments`, { message }),

  deleteComment: (commentId: string) =>
    api.delete(`/api/tickets/comments/${commentId}`),
}

export const vendorStatsApi = {
  getAll: () => api.get('/api/admin/vendors/stats'),
}