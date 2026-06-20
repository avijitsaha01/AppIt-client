import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'

export function DashboardLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}
