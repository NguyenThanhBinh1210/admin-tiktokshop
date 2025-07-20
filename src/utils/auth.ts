/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from 'src/types/user.type'
import jwt_decode from 'jwt-decode'
export const setAccesTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
export const getDarkModeFromLS = () => {
  const result = localStorage.getItem('darkmode')
  return result ? JSON.parse(result) : null
}

export const setProfileFromLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const setDarkModeFromLS = (dark: boolean) => {
  localStorage.setItem('darkmode', JSON.stringify(dark))
}
const isJsonString = (data: any) => {
  try {
    JSON.parse(data)
  } catch (error) {
    return false
  }
  return true
}
export const handleDecoded = () => {
  let storageData = localStorage.getItem('access_token')
  let decoded = {}
  if (storageData && isJsonString(storageData)) {
    storageData = JSON.parse(storageData)
    decoded = jwt_decode(storageData as string)
  }
  return { decoded, storageData }
}
