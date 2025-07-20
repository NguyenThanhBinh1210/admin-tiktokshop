import { User } from '~/types/user.type'
import http from '~/utils/http'
import serverGet from '~/utils/serverGet'
interface BodyUpdateProfile extends Omit<User, '_id' | 'role' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

export const loginAccount = (body: { email: string; password: string }) => http.post('/v1/auth/login', body)
export const logout = () => http.post('/user/log-out')
export const updateUser = (id: unknown, params?: Omit<BodyUpdateProfile, '_id'>) =>
  http.put<User>(`/user/update-user/${id}`, params)
export const updateRole = (id: unknown, body: any) => http.patch(`/v1/user/update-role/${id}`, body)
export const getUser = (id: unknown) => serverGet.get<User>(`/user/get-details/${id}`)
// export const refreshToken = (body: { refresh_token: string }) => http.post('/user/refresh-token', body)
export const refreshToken = () =>
  http.post('/user/refresh-token', {
    withCredentials: true
  })
