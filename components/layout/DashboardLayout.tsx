'use client'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        <div className="max-w-6xl mx-auto p-6 lg:p-8 page-enter">
          {children}
        </div>
      </main>
    </div>
  )
}
