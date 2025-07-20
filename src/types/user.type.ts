export interface User {
  name?: string
  email?: string
  password?: string
  isAdmin?: boolean
  phone?: number
  avatar?: string
  address?: string
  role?: string
  _id?: string
  createdAt?: string
  updatedAt?: string
}

export interface ListUser {
  data?: User[]
  message?: string
  status?: string
}
