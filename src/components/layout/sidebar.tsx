import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import {
  ShoppingCart,
  ClipboardList,
  PlusCircle,
  Star,
  Users,
  LayoutDashboard,
  LogOut,
  Package,
  MessageSquare,
  UserCog,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
              A
            </div>
            <span className="text-lg font-bold">
              App<span className="text-blue-600">It</span>
            </span>
          </NavLink>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-sm text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{user?.name}</p>
              <p className="truncate text-xs text-neutral-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              isAdmin() ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
            )}>
              {isAdmin() ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Menu
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-600 to-purple-600" />
                  )}
                  <link.icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-neutral-600 hover:bg-red-50 hover:text-red-600"
            onClick={() => { logout(); onClose() }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
