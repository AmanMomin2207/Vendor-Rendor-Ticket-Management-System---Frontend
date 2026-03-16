# TicketFlow — Frontend

> Next.js 14 web application for the Buyer–Vendor Ticket Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Deploy](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## 🌐 Live App

```
https://vendorbuyerticketmanagement.vercel.app
```

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [Role-Based Access](#-role-based-access)
- [API Integration](#-api-integration)
- [Deployment](#-deployment-vercel)

---

## ✨ Features

- 🎨 Dark professional UI with glass morphism design
- 🔐 JWT authentication stored in browser cookies
- 👥 Role-aware routing — Buyer, Vendor, Admin dashboards
- 🎫 Full ticket management with filters, search, pagination, and sorting
- 📎 File attachment upload and inline preview (images + PDFs)
- 💬 Real-time comment threads per ticket
- 📜 Status history timeline with actor info
- 📊 Vendor performance analytics dashboard
- 📱 Fully responsive — mobile drawer + desktop sidebar
- 🔔 Toast notifications for all actions

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React SSR framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client with interceptors |
| js-cookie | JWT token storage |
| react-hot-toast | Notifications |
| lucide-react | Icon library |

---

## 📁 Project Structure

```
src/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with Toaster
│   ├── page.tsx                      # Redirect to dashboard or login
│   ├── globals.css                   # Global styles + dark theme
│   │
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   │
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── buyer/page.tsx            # Buyer dashboard
│   │   ├── vendor/page.tsx           # Vendor dashboard
│   │   └── admin/page.tsx            # Admin dashboard
│   │
│   ├── tickets/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Ticket list with filters
│   │   ├── new/page.tsx              # Create new ticket
│   │   └── [id]/page.tsx             # Ticket detail
│   │
│   ├── users/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Admin: user management
│   │
│   ├── vendors/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Admin: vendor performance stats
│   │
│   └── profile/
│       ├── layout.tsx
│       └── page.tsx                  # Profile view & edit
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Role-aware navigation sidebar
│   │   └── DashboardLayout.tsx       # Layout wrapper with sidebar
│   │
│   ├── tickets/
│   │   ├── TicketTable.tsx           # Paginated filterable ticket list
│   │   ├── TicketDetail.tsx          # Full ticket view + all actions
│   │   ├── CreateTicketForm.tsx      # Ticket creation form
│   │   ├── TicketTimeline.tsx        # Status history timeline
│   │   ├── TicketComments.tsx        # Comment thread
│   │   ├── AttachmentUpload.tsx      # File picker for ticket creation
│   │   └── AttachmentViewer.tsx      # File preview + download
│   │
│   └── ui/
│       ├── StatCard.tsx              # Dashboard metric card
│       ├── Modal.tsx                 # Reusable modal dialog
│       ├── Badges.tsx                # Status + priority badges
│       └── Skeleton.tsx              # Loading skeleton shimmer
│
├── lib/
│   ├── api.ts                        # Axios instance + all API calls
│   ├── auth.ts                       # Token helpers (get/set/clear/role)
│   └── utils.ts                      # Date formatting, color utilities
│
└── types/
    └── index.ts                      # TypeScript interfaces for all entities
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ticket-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Open `lib/api.ts` and set the backend URL:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  || 'https://vendor-rendor-ticket-management-system-qir0.onrender.com'
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=https://vendor-rendor-ticket-management-system-qir0.onrender.com
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | No (has default) |

---

## 🗺 Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login with email + password |
| `/register` | Public | Create new account (select role) |
| `/dashboard/buyer` | BUYER | Ticket stats + quick actions |
| `/dashboard/vendor` | VENDOR | Assigned tickets overview |
| `/dashboard/admin` | ADMIN | System-wide analytics |
| `/tickets` | ALL | Paginated ticket list with filters |
| `/tickets/new` | BUYER | Create new support ticket |
| `/tickets/[id]` | ALL | Full ticket detail + actions |
| `/users` | ADMIN | Manage all users |
| `/vendors` | ADMIN | Vendor performance stats |
| `/profile` | ALL | View and edit own profile |

---

## 🧩 Components

### `TicketTable`
- Displays paginated tickets (8 per page)
- Filter by **status**, **priority**, **free-text search**
- Sort by createdAt, title, priority, status (asc/desc)
- Role-aware: buyers see own, vendors see assigned, admins see all
- CSV export button (admin only)

### `TicketDetail`
- Full ticket info with meta grid (creator, assignee, dates)
- **Admin:** Assign to vendor via searchable dropdown modal
- **Vendor:** Move to IN_PROGRESS / RESOLVED with optional resolution note
- **Buyer:** Close a RESOLVED ticket
- Attachment viewer with inline preview
- Status history timeline
- Comment thread

### `AttachmentUpload`
- Drag-click file picker
- Client-side 5MB size validation
- Shows file name + size after selection
- Passes raw `File` object (no Base64 conversion)

### `AttachmentViewer`
- Shows file name, type icon, size
- **Preview** button for images and PDFs (inline render)
- **Download** button for all file types
- Streams from backend GridFS

### `TicketTimeline`
- Vertical timeline of every status transition
- Shows old → new status with color-coded badges
- Actor and timestamp per entry

### `TicketComments`
- Chat-style comment thread
- Enter to send, Shift+Enter for new line
- Role badge per comment
- Admin can delete any comment (hover to reveal)

---

## 👥 Role-Based Access

### BUYER
- ✅ Create tickets with file attachments
- ✅ View own tickets only
- ✅ Close RESOLVED tickets
- ✅ Comment on own tickets
- ❌ Cannot assign or resolve tickets

### VENDOR
- ✅ View assigned tickets only
- ✅ Move ticket to IN_PROGRESS or RESOLVED
- ✅ Add resolution note when resolving
- ✅ Comment on assigned tickets
- ❌ Cannot create or close tickets

### ADMIN
- ✅ View all tickets system-wide
- ✅ Assign OPEN tickets to vendors
- ✅ Manage all users (toggle/delete)
- ✅ View vendor performance stats
- ✅ Export all tickets as CSV
- ✅ Delete any comment

---

## 🔌 API Integration

All API calls are defined in `lib/api.ts`:

```ts
// Auth
authApi.register(data)
authApi.login(data)

// Tickets
ticketApi.getTickets(params)
ticketApi.createTicket(formData)       // multipart/form-data with optional file
ticketApi.getTicketById(id)
ticketApi.assignTicket(id, vendorId)
ticketApi.updateStatus(id, status, resolutionNote?)
ticketApi.closeTicket(id)
ticketApi.exportCSV()
ticketApi.downloadAttachment(id)

// Comments
commentApi.getComments(ticketId)
commentApi.addComment(ticketId, message)
commentApi.deleteComment(commentId)

// Users
userApi.getAll()
userApi.toggleUser(id)
userApi.deleteUser(id)

// Profile
profileApi.getProfile()
profileApi.updateProfile(data)

// Dashboard
dashboardApi.getBuyerStats()
dashboardApi.getVendorStats()
dashboardApi.getAdminStats()

// Vendor stats
vendorStatsApi.getStats()
```

### Axios Interceptors

```ts
// Request interceptor — auto-attaches JWT
config.headers.Authorization = `Bearer ${token}`

// Response interceptor — handles 401/403
// Clears cookies and redirects to /login
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary accent | Indigo `#6366F1` |
| Background | `#0F1117` |
| Surface | `#1A1D27` |
| Border | `rgba(255,255,255,0.05)` |
| Font — Display | Syne (headings) |
| Font — Body | DM Sans |

### Status Colors

| Status | Color |
|---|---|
| OPEN | Blue |
| ASSIGNED | Purple |
| IN_PROGRESS | Amber |
| RESOLVED | Green |
| CLOSED | Gray |

### Priority Colors

| Priority | Color |
|---|---|
| LOW | Emerald |
| MEDIUM | Amber |
| HIGH | Red |

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Vercel auto-detects Next.js — no config needed
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy — auto-rebuilds on every push to `main`

### Make sure backend CORS includes your Vercel URL

In `SecurityConfig.java` or `CorsConfig.java`:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "https://vendorbuyerticketmanagement.vercel.app"
));
```

---

## 🐛 Common Issues

| Issue | Fix |
|---|---|
| Hydration error on sidebar | `getRole()` must be inside `useEffect` with `useState` |
| Page refreshes on ticket create | Button must be `type="button"`, not inside `<form>` |
| 401 on all requests | Token expired or not set — check cookies in DevTools |
| CORS error | Add Vercel URL to backend CORS config |
| Slow first load | Render free tier cold start — wait 30-60 seconds |
| Vendors not loading in assign modal | Check `userApi.getAll()` returns users with `role === 'VENDOR'` |

---

## 📝 License

This project is for educational and demonstration purposes.
