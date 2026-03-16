import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'TicketFlow — Vendor Ticket Management',
  description: 'Professional ticket management system for buyers, vendors, and admins',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise bg-grid min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181f',
              color: '#e2e2e8',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#18181f' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#18181f' } },
          }}
        />
      </body>
    </html>
  )
}
