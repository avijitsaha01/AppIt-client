import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute, AdminRoute } from '@/components/layout/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PublicLayout } from '@/components/layout/public-layout'
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
import About from '@/pages/about'
import Services from '@/pages/services'
import PortfolioList from '@/pages/portfolio'
import PortfolioDetail from '@/pages/portfolio/[slug]'
import Products from '@/pages/products'
import Team from '@/pages/team'
import Careers from '@/pages/careers'
import BlogList from '@/pages/blog'
import BlogDetail from '@/pages/blog/[slug]'
import Contact from '@/pages/contact'
import Tickets from '@/pages/dashboard/tickets'
import TicketDetail from '@/pages/dashboard/tickets/[id]'
import Invoices from '@/pages/dashboard/invoices'
import ManageTeam from '@/pages/dashboard/admin/manage-team'
import ManageBlog from '@/pages/dashboard/admin/manage-blog'
import ManagePortfolio from '@/pages/dashboard/admin/manage-portfolio'
import ManageProducts from '@/pages/dashboard/admin/manage-products'
import ManageJobs from '@/pages/dashboard/admin/manage-jobs'
import ManageApplications from '@/pages/dashboard/admin/manage-applications'
import ManageLeads from '@/pages/dashboard/admin/manage-leads'
import ManageTickets from '@/pages/dashboard/admin/manage-tickets'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PublicLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<PortfolioList />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
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
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="invoices" element={<Invoices />} />
            <Route
              path="manage-team"
              element={
                <AdminRoute>
                  <ManageTeam />
                </AdminRoute>
              }
            />
            <Route
              path="manage-blog"
              element={
                <AdminRoute>
                  <ManageBlog />
                </AdminRoute>
              }
            />
            <Route
              path="manage-portfolio"
              element={
                <AdminRoute>
                  <ManagePortfolio />
                </AdminRoute>
              }
            />
            <Route
              path="manage-products"
              element={
                <AdminRoute>
                  <ManageProducts />
                </AdminRoute>
              }
            />
            <Route
              path="manage-jobs"
              element={
                <AdminRoute>
                  <ManageJobs />
                </AdminRoute>
              }
            />
            <Route
              path="manage-applications"
              element={
                <AdminRoute>
                  <ManageApplications />
                </AdminRoute>
              }
            />
            <Route
              path="manage-leads"
              element={
                <AdminRoute>
                  <ManageLeads />
                </AdminRoute>
              }
            />
            <Route
              path="manage-tickets"
              element={
                <AdminRoute>
                  <ManageTickets />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
