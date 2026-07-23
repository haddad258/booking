# Hotel Booking Platform — Admin Dashboard (Phase 2)

A React admin dashboard for hotel/chalet operations staff: bookings, inventory, guests, revenue and site configuration.

## Tech Stack

- **React 19** + **Vite**
- **Material UI** (custom "ink & brass" hospitality theme, light/dark mode)
- **React Router** for navigation, route guards for auth + super-admin-only pages
- **Axios** with automatic JWT refresh-on-401
- **React Hook Form** for all create/edit forms
- **Chart.js** (via react-chartjs-2) for dashboard charts
- **i18next** — English, French, Arabic (with RTL switching)
- **notistack** for toast notifications
- **SheetJS (xlsx)** for Excel report export

## Getting Started

```bash
cd admin
cp .env.example .env      # point VITE_API_URL at your backend, default http://localhost:5000/api/v1
npm install
npm run dev                # http://localhost:5173
```

Log in with the seeded super admin from the backend: `admin@hotelbooking.com` / `ChangeMe123!`

## Project Structure

```
admin/
  src/
    components/    # Sidebar, Topbar, DataTable, EntityDialog, StatCard, StatusChip, etc.
    pages/          # One file per route
    layouts/        # DashboardLayout (sidebar+topbar shell), AuthLayout
    hooks/          # useDataTable (server pagination/search), useToast
    contexts/       # AuthContext, ThemeModeContext
    services/       # axios instance + one service module per API resource
    i18n/           # en/fr/ar translations
    styles/         # MUI theme + design tokens, global.css
```

## Pages

- **Dashboard** — KPI cards, revenue chart, bookings-by-status chart, occupancy rate
- **Bookings** — list with status filter, detail page with payments/refunds/status transitions
- **Calendar** — month view of check-ins, click a day to see that day's bookings
- **Hotels** — CRUD, detail page for rooms + image gallery
- **Chalets** — CRUD, detail page for image gallery
- **Amenities** — shared amenities CRUD
- **Customers** — list, detail page with addresses and status control
- **Reviews** — moderation queue (approve/reject)
- **Reports** — booking & revenue reports with date range filter, Excel export, print-to-PDF
- **Admins** *(super admin only)* — admin account CRUD
- **Roles & Permissions** *(super admin only)* — per-module CRUD permission matrix editor
- **Settings** — website / SMTP / languages / currency / taxes / SEO, tabbed editor

## Design

Custom MUI theme: deep ink-navy sidebar with a warm brass accent (evoking a hotel key card), Space Grotesk for headings, Inter for body copy, and IBM Plex Mono for booking numbers/prices to reinforce an "operational ledger" feel. The active sidebar item renders with a small brass tab notch on its left edge. Full light/dark mode support.

## Notes

- All data fetching goes through `src/services/api.js`, which automatically retries a request once after silently refreshing the access token on a 401.
- `useDataTable` standardizes server-side pagination + debounced search across every list page — new resource pages can reuse it directly.
- Permission-gated UI currently uses `user.is_super_admin` for the two admin-only routes; the backend enforces the full per-module permission matrix regardless of what the UI shows.
