import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
