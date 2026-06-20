import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute, AdminRoute } from '@/components/layout/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Register from '@/pages/register'
import DashboardOverview from '@/pages/dashboard'
import PlaceOrder from '@/pages/dashboard/orders/place-order'
import ServiceList from '@/pages/dashboard/orders/service-list'
import ServicesList from '@/pages/dashboard/admin/services-list'
import ServiceAdd from '@/pages/dashboard/admin/service-add'
import MakeAdmin from '@/pages/dashboard/admin/make-admin'
import CreateReview from '@/pages/dashboard/reviews/create-review'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="order" element={<PlaceOrder />} />
            <Route path="service-list" element={<ServiceList />} />
            <Route
              path="servicesList"
              element={
                <AdminRoute>
                  <ServicesList />
                </AdminRoute>
              }
            />
            <Route
              path="serviceAdd"
              element={
                <AdminRoute>
                  <ServiceAdd />
                </AdminRoute>
              }
            />
            <Route
              path="makeAdmin"
              element={
                <AdminRoute>
                  <MakeAdmin />
                </AdminRoute>
              }
            />
            <Route path="create-review" element={<CreateReview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
