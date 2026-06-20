export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Service {
  _id: string
  title: string
  description: string
  image?: string
  icon?: string
}

export interface Order {
  _id: string
  user: string | User
  service: string | { _id: string; title: string }
  name: string
  email: string
  companyName: string
  details: string
  price: number
  image?: string
  status: 'pending' | 'on-going' | 'done'
  createdAt: string
}

export interface Partner {
  _id: string
  name: string
  logo: string
}

export interface Slider {
  _id: string
  title?: string
  subtitle?: string
  image: string
}

export interface Review {
  _id: string
  user: string | User
  name: string
  designation?: string
  description: string
  image?: string
  rating?: number
  createdAt: string
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  image?: string
  socialLinks?: { label: string; url: string }[]
  order: number
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  image?: string
  author: string
  publishedAt?: string
  status: 'draft' | 'published'
  createdAt: string
}

export interface Job {
  _id: string
  title: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  description: string
  requirements: string[]
  deadline: string
  status: 'open' | 'closed'
}

export interface JobApplication {
  _id: string
  job: string | { _id: string; title: string }
  name: string
  email: string
  phone: string
  resumeFile?: string
  coverLetter?: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
}

export interface ContactRequest {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

export interface Product {
  _id: string
  name: string
  description: string
  features: string[]
  image?: string
  pricing: string
  trialLink?: string
  status: 'active' | 'inactive'
}

export interface Portfolio {
  _id: string
  title: string
  slug: string
  description: string
  image?: string
  techUsed: string[]
  client?: string
  url?: string
  impact?: string
  status: 'draft' | 'published'
}

export interface Ticket {
  _id: string
  user: string | User
  subject: string
  message: string
  replies: { user: string | User; message: string; createdAt: string }[]
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface Invoice {
  _id: string
  user: string | User
  order: string | { _id: string; name: string }
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidAt?: string
}
