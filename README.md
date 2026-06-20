# AppIt Client

Frontend for AppIt — a creative agency management platform. Built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

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
| **Zustand** | Client state management |
| **Axios** | HTTP client with JWT interceptor |
| **React Hook Form + Zod** | Form validation |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

## Features

- **JWT Authentication** — Register, login, and session management
- **Role-based UI** — Different dashboards for customers and admins
- **Landing Page** — Hero section, services grid, partners, carousel, reviews
- **Order Placement** — Select services, upload files, submit orders
- **Order Tracking** — View order status (pending / on-going / done)
- **Admin Dashboard** — Manage orders, services, partners, sliders, admins
- **Review System** — Submit customer reviews with star ratings
- **Responsive Design** — Mobile-first with Tailwind utility classes
- **Protected Routes** — Auth guards for dashboard and admin pages

## Pages

### Public

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, services, partners, carousel, reviews |
| `/login` | Login | JWT login form |
| `/register` | Register | New user registration |

### Dashboard (Protected)

| Route | Page | Role | Description |
|-------|------|------|-------------|
| `/dashboard` | Overview | All | Stats summary |
| `/dashboard/order` | Place Order | Customer | New service order |
| `/dashboard/service-list` | My Orders | Customer | View own orders |
| `/dashboard/servicesList` | All Orders | Admin | View/edit all orders |
| `/dashboard/serviceAdd` | Add Service | Admin | Create new service |
| `/dashboard/makeAdmin` | Manage Admins | Admin | Promote users to admin |
| `/dashboard/create-review` | Create Review | Customer | Submit feedback |

## Getting Started

### Prerequisites

- Node.js 20+
- AppIt Server running (or a deployed backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/avijitsaha01/AppIt-client.git
cd AppIt-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Edit `.env` with your server URL:

```env
VITE_API_URL=http://localhost:8080/api
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
│   │   ├── dashboard-layout.tsx   # Dashboard shell (sidebar + content)
│   │   ├── footer.tsx             # Site footer
│   │   ├── header.tsx             # Site header with auth state
│   │   ├── protected-route.tsx    # Auth & admin route guards
│   │   └── sidebar.tsx            # Dashboard sidebar navigation
│   └── ui/                        # shadcn-style UI primitives
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── separator.tsx
├── hooks/                         # Custom React hooks
├── lib/
│   ├── api.ts                     # Axios instance with JWT interceptor
│   └── utils.ts                   # cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── make-admin.tsx     # Promote users to admin
│   │   │   ├── service-add.tsx    # Create new service
│   │   │   └── services-list.tsx  # All orders with status updates
│   │   ├── orders/
│   │   │   ├── place-order.tsx    # New order form
│   │   │   └── service-list.tsx   # Customer's orders
│   │   ├── reviews/
│   │   │   └── create-review.tsx  # Submit review
│   │   └── index.tsx              # Dashboard overview
│   ├── home/
│   │   └── index.tsx              # Landing page
│   ├── login/
│   │   └── index.tsx              # Login page
│   └── register/
│       └── index.tsx              # Registration page
├── store/
│   └── auth.store.ts              # Zustand auth store
├── types/
│   └── index.ts                   # TypeScript interfaces
├── App.tsx                        # Router & providers setup
├── main.tsx                       # Entry point
├── index.css                      # Tailwind imports
└── vite-env.d.ts                  # Vite type declarations
```

## State Management

- **Zustand** — Auth state (user, token, login/logout actions)
- **TanStack Query** — All server data (services, orders, reviews, partners, sliders)
- **localStorage** — Persist JWT token and user data across sessions

## Authentication Flow

1. User registers or logs in → server returns JWT token + user object
2. Token stored in `localStorage` and Zustand store
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. 401 responses auto-clear auth state and redirect to login
5. Protected routes check auth state before rendering

## Styling

- **Tailwind CSS v4** for all styling (utility classes)
- **shadcn/ui** components with consistent design tokens
- Responsive breakpoints for mobile, tablet, and desktop
- Dark/light mode ready (neutral color palette)

## Connecting to the API

The client expects the AppIt Server API running at the URL specified in `VITE_API_URL`. See the [AppIt Server](https://github.com/avijitsaha01/AppIt-Server) repository for setup instructions.

## Migrating from v1

This is a complete rewrite. Key changes:
- **Create React App → Vite** for faster dev and builds
- **React 16 → React 19** with latest features
- **JavaScript → TypeScript** with strict mode
- **Bootstrap 4 + plain CSS → Tailwind v4 + shadcn/ui**
- **React Context API → Zustand** for auth state
- **Raw fetch() → Axios + TanStack Query** with caching
- **React Router v5 → React Router v7**
- **Firebase Auth → JWT auth** with custom login/register pages
- **Feature-based folders → Page-based structure**
