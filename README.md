# TicketFlow — Frontend

A production-grade ticket management frontend built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — custom dark theme
- **Axios** — API calls with JWT interceptors
- **react-hot-toast** — notifications
- **lucide-react** — icons
- **js-cookie** — JWT token storage

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Visit `http://localhost:3000`

## Backend
Connected to: `https://vendor-rendor-ticket-management-system-qir0.onrender.com`

## Features

### Auth
- Login / Register with role selection (BUYER / VENDOR / ADMIN)
- JWT stored in cookies, auto-attached to all requests
- Auto-redirect based on role after login

### Buyer
- Dashboard with ticket stats
- Create new tickets with priority selection
- View own tickets with filters & pagination
- Close resolved tickets

### Vendor
- Dashboard with work queue stats
- View assigned tickets
- Update status: ASSIGNED → IN_PROGRESS → RESOLVED

### Admin
- Full system dashboard with resolution rate
- View ALL tickets with filters, search, sort, pagination
- Assign tickets to vendors by user ID
- Export all tickets to CSV

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard/buyer` | Buyer overview |
| `/dashboard/vendor` | Vendor work queue |
| `/dashboard/admin` | Admin system overview |
| `/tickets` | Ticket list (role-aware) |
| `/tickets/new` | Create ticket (buyer) |
| `/tickets/[id]` | Ticket detail & actions |

## Notes
- The backend is hosted on Render free tier — first request may be slow (cold start ~30s)
- Admin assign ticket requires the vendor's MongoDB `_id` (not email)
