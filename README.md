# AppIt Client

Frontend for [AppIt](https://itclient.vercel.app) — a full-service digital agency platform with public website, client portal, and admin dashboard. Built with **Vite 8**, **React 19**, **TypeScript 6**, **Tailwind CSS v4**, and **shadcn/ui**.

**Live Site:** https://itclient.vercel.app

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite 8** | Build tool & dev server |
| **React 19** | UI framework |
| **TypeScript 6** | Type safety |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Component library (Radix primitives) |
| **TanStack Query v5** | Server state & caching |
| **Zustand** | Client state management (auth) |
| **Axios** | HTTP client with JWT interceptor |
| **React Hook Form + Zod** | Form validation |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

## Pages & Features

### Public Pages

| Route | Page | Features |
|-------|------|----------|
| `/` | **Home** | Dark hero section with animated gradient, services overview, portfolio grid, testimonials carousel, partner logos, contact CTA, footer |
| `/about` | **About** | Company story, mission & vision, values cards, team member grid, certifications showcase |
| `/services` | **Services** | Service detail cards (6 services), process steps timeline, CTA section |
| `/portfolio` | **Portfolio** | Tech filter tabs, project grid with hover effects |
| `/portfolio/:slug` | **Portfolio Detail** | Full project info, tech badges, business impact metrics, live link |
| `/products` | **Products** | Product catalog with feature lists, pricing cards, trial links |
| `/team` | **Team** | Department-grouped team cards with profile images, culture section |
| `/careers` | **Careers** | Job listings with type/level badges, recruitment process, application form with file upload (name, email, phone, cover letter, resume) |
| `/blog` | **Blog** | Featured post hero, article grid with tag filters |
| `/blog/:slug` | **Blog Post** | Full article with featured image, markdown content, related posts sidebar |
| `/contact` | **Contact** | Split layout — contact form with validation, info cards (email, phone, address), map placeholder |

### Auth Pages

| Route | Page | Features |
|-------|------|----------|
| `/login` | **Login** | Email/password sign in with validation |
| `/register` | **Register** | New account creation with confirmation |

### Client Dashboard

| Route | Page | Features |
|-------|------|----------|
| `/dashboard` | **Overview** | Metrics cards (total orders, active, completed), recent orders table, quick action buttons |
| `/dashboard/order` | **Place Order** | Service selection cards, order details form with file upload |
| `/dashboard/service-list` | **My Orders** | Orders table with search, status tabs (all/pending/on-going/done), progress timeline modal |
| `/dashboard/tickets` | **Support Tickets** | Ticket list with status badges, create ticket modal |
| `/dashboard/tickets/:id` | **Ticket Detail** | Message thread with replies, reply form |
| `/dashboard/invoices` | **Invoices** | Invoice table with status badges (paid/unpaid/overdue), download link |
| `/dashboard/create-review` | **Create Review** | Star rating selector, testimonial form |

### Admin Dashboard

| Route | Page | Features |
|-------|------|----------|
| `/dashboard` | **Overview** | All orders overview with metrics |
| `/dashboard/servicesList` | **All Orders** | Full orders table with search, status filter, pagination, inline status change |
| `/dashboard/serviceAdd` | **Add Service** | Create service form with image upload |
| `/dashboard/makeAdmin` | **Manage Admins** | Users table with promote/demote admin controls |
| `/dashboard/manage-team` | **Manage Team** | Team member cards, add/edit modal with image upload |
| `/dashboard/manage-blog` | **Manage Blog** | Blog posts table, create/edit page with markdown content editor |
| `/dashboard/manage-portfolio` | **Manage Portfolio** | Portfolio projects table, create/edit page with tech stack management |
| `/dashboard/manage-products` | **Manage Products** | Product catalog CRUD with features and pricing |
| `/dashboard/manage-jobs` | **Manage Jobs** | Job posting CRUD with type, location, requirements |
| `/dashboard/manage-applications` | **Applications** | Application table with resume downloads, status update (pending/reviewed/shortlisted/rejected) |
| `/dashboard/manage-leads` | **Contact Leads** | Contact inquiry table, mark read/replied, delete |
| `/dashboard/manage-tickets` | **Support Tickets** | All tickets table with search, inline status change, reply form |
| `/dashboard/manage-invoices` | **Invoices** | All invoices table, create invoice modal, status update |

## Key Features

- **JWT Authentication** — Secure login/register with token persistence in localStorage
- **Role-based Access** — Protected routes, admin-only pages, user-specific data scoping
- **Image Uploads** — Multer-backed file uploads with preview
- **Order Progress Tracking** — Visual timeline modal showing status progression
- **Support Ticket System** — Threaded replies between customer and admin
- **Invoice Management** — Auto-numbered invoices linked to orders
- **Job Applications** — Resume upload and status tracking
- **Responsive Design** — Mobile-friendly public pages + dashboard
- **SEO Ready** — Dynamic page titles, semantic HTML structure
- **Dark Theme** — Consistent dark color palette throughout

## Getting Started

### Prerequisites

- Node.js 20+
- AppIt Server running (local or deployed)

### Installation

```bash
git clone https://github.com/avijitsaha01/AppIt-client.git
cd AppIt-client
npm install
cp .env.example .env
```

### Configuration

```env
VITE_API_URL=https://appit-server.onrender.com/api
```

### Running

```bash
# Development server (port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── dashboard-layout.tsx     # Dashboard shell (sidebar + header + content)
│   │   ├── footer.tsx               # Site footer
│   │   ├── header.tsx               # Site header with auth state
│   │   ├── protected-route.tsx      # Auth & admin route guards
│   │   └── sidebar.tsx              # Dashboard sidebar navigation
│   ├── shared/                      # Shared components
│   │   ├── empty-state.tsx          # Empty state placeholder
│   │   ├── loading-skeleton.tsx     # Loading skeleton component
│   │   └── page-hero.tsx            # Page hero banner
│   └── ui/                          # shadcn-style UI primitives (20+ components)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── ...
├── hooks/                           # Custom React hooks
├── lib/
│   ├── api.ts                       # Axios instance with JWT interceptor
│   └── utils.ts                     # cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── home/index.tsx               # Landing page
│   ├── about/index.tsx              # About page
│   ├── services/index.tsx           # Services page
│   ├── portfolio/
│   │   ├── index.tsx                # Portfolio grid
│   │   └── [slug].tsx               # Portfolio detail
│   ├── products/index.tsx           # Products page
│   ├── team/index.tsx               # Team page
│   ├── careers/index.tsx            # Careers + application form
│   ├── blog/
│   │   ├── index.tsx                # Blog list
│   │   └── [slug].tsx               # Blog post detail
│   ├── contact/index.tsx            # Contact page
│   ├── login/index.tsx              # Login page
│   ├── register/index.tsx           # Register page
│   └── dashboard/                   # All dashboard pages
│       ├── index.tsx                # Dashboard overview
│       ├── admin/                   # Admin pages (11 pages)
│       │   ├── make-admin.tsx
│       │   ├── manage-applications.tsx
│       │   ├── manage-blog.tsx
│       │   ├── manage-invoices.tsx
│       │   ├── manage-jobs.tsx
│       │   ├── manage-leads.tsx
│       │   ├── manage-portfolio.tsx
│       │   ├── manage-products.tsx
│       │   ├── manage-team.tsx
│       │   ├── manage-tickets.tsx
│       │   ├── service-add.tsx
│       │   └── services-list.tsx
│       ├── client/                  # Client pages
│       │   ├── invoices.tsx
│       │   ├── place-order.tsx
│       │   ├── service-list.tsx
│       │   ├── support-ticket-detail.tsx
│       │   ├── support-tickets.tsx
│       │   └── create-review.tsx
│       └── components/              # Dashboard sub-components
│           ├── application-modal.tsx
│           ├── manage-ticket-detail.tsx
│           ├── order-progress-modal.tsx
│           ├── ticket-detail.tsx
│           └── timeline-progress.tsx
├── store/
│   └── auth.store.ts                # Zustand auth store
├── types/
│   └── index.ts                     # TypeScript interfaces
├── App.tsx                          # Router & providers setup
├── main.tsx                         # Entry point
├── index.css                        # Tailwind imports + global styles
└── vite-env.d.ts                    # Vite type declarations
```

## State Management

- **Zustand** — Auth state (user, token, login/logout actions)
- **TanStack Query** — All server data (services, orders, reviews, partners, sliders, team, blog, portfolio, products, jobs, tickets, invoices)
- **localStorage** — Persist JWT token and user data across sessions

## Authentication Flow

1. User registers or logs in → server returns JWT token + user object
2. Token stored in `localStorage` and Zustand store
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. 401 responses auto-clear auth state and redirect to login
5. Protected routes check auth state before rendering
6. Admin routes additionally check `role === "admin"`

## Connecting to the API

The client expects the AppIt Server API running at the URL specified in `VITE_API_URL`. See the [AppIt Server](https://github.com/avijitsaha01/AppIt-Server) repository for setup instructions.

## Deployment

### Vercel

1. Push to GitHub
2. Import repo on Vercel
3. Set framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add env variable: `VITE_API_URL=https://appit-server.onrender.com/api`
7. Deploy

> **Important:** The `@tailwindcss/vite` package must be in `dependencies` in `package.json` (not `devDependencies`) for Vercel builds to succeed.
