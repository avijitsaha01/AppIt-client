import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import {
  ShoppingCart,
  ClipboardList,
  PlusCircle,
  Star,
  Users,
  Settings,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const customerLinks = [
  { to: '/dashboard/order', label: 'Place Order', icon: ShoppingCart },
  { to: '/dashboard/service-list', label: 'My Orders', icon: ClipboardList },
  { to: '/dashboard/create-review', label: 'Create Review', icon: Star },
]

const adminLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/servicesList', label: 'All Orders', icon: ClipboardList },
  { to: '/dashboard/serviceAdd', label: 'Add Service', icon: PlusCircle },
  { to: '/dashboard/makeAdmin', label: 'Manage Admins', icon: Users },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { isAdmin, user, logout } = useAuthStore()
  const links = isAdmin() ? adminLinks : customerLinks

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold">
          App<span className="text-blue-600">It</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="mb-2 text-sm text-neutral-600">{user?.name}</div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
