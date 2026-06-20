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
