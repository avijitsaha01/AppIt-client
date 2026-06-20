import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import {
  ShoppingCart,
  ClipboardList,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Package,
  MessageSquare,
  UserCog,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const customerLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/order', label: 'Place Order', icon: ShoppingCart },
  { to: '/dashboard/service-list', label: 'My Orders', icon: Package },
  { to: '/dashboard/create-review', label: 'Create Review', icon: MessageSquare },
]

const adminLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/servicesList', label: 'All Orders', icon: ClipboardList },
  { to: '/dashboard/serviceAdd', label: 'Add Service', icon: PlusCircle },
  { to: '/dashboard/makeAdmin', label: 'Manage Admins', icon: UserCog },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { isAdmin, user, logout } = useAuthStore()
  const links = isAdmin() ? adminLinks : customerLinks
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0f0f10] text-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-bold text-[#0f0f10]">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight">
              App<span className="text-blue-400">It</span>
            </span>
          </NavLink>
          <button className="text-white/40 hover:text-white lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-white/10 text-[11px] font-medium text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-white">{user?.name}</p>
              <p className="truncate text-[11px] text-white/40">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white/30">
            Main Menu
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
                )
              }
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <button
            onClick={() => { logout(); onClose() }}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
