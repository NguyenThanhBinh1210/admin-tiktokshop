// import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
  name?: string
  email?: string
  password?: string
  isAdmin?: boolean
  role?: string
  _id?: string
  createdAt?: string
  updatedAt?: string
}>
