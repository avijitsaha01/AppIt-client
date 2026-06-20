import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth.store'
import { LayoutDashboard, LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/60 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button className="text-neutral-400 hover:text-neutral-600 lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-bold text-white">
            A
          </div>
          <span className="text-sm font-semibold">
            App<span className="text-blue-600">It</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-neutral-800 text-[10px] font-medium text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-[13px] font-medium text-neutral-700 sm:inline-block">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-[13px]">{user.name}</span>
                  <span className="text-[11px] font-normal text-neutral-400">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-[13px]">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[13px] text-red-500 focus:bg-red-50 focus:text-red-600"
                onClick={() => { logout(); navigate('/') }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-[13px]" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" className="bg-neutral-900 text-[13px] text-white hover:bg-neutral-800" onClick={() => navigate('/register')}>Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  )
}
