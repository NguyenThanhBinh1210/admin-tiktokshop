import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { getAccessTokenFromLS, setAccesTokenToLS, setProfileFromLS, clearLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      // baseURL: 'https://api-amazon-luaga.onrender.com/api/',
      baseURL: 'https://admin.ordersdropship.com/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          console.log('this.accessToken', this.accessToken)
          config.headers['Authorization'] = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { url } = response.config

        // Xử lý khi login thành công
        if (url === '/v1/auth/login') {
          const dataProfile = response
          const newUser = dataProfile.data.user
          this.accessToken = response.data.token
          
          setProfileFromLS(newUser)
          setAccesTokenToLS(this.accessToken)
        } 
        // Xử lý khi logout
        else if (url === '/user/log-out') {
          this.handleLogout()
        }

        return response
      },
      (error: AxiosError) => {
        // Xử lý khi token hết hạn (401 Unauthorized)
        if (error.response?.status === 401) {
          console.log('Token expired, logging out...')
          this.handleLogout()
          
          // Redirect về trang login
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Method để xử lý logout
  private handleLogout() {
    this.accessToken = ''
    clearLS() // Clear toàn bộ localStorage
    
    // Hoặc nếu bạn muốn chỉ clear specific items:
    // localStorage.removeItem('access_token')
    // localStorage.removeItem('user_profile')
  }

  // Method để update token manually nếu cần
  public updateToken(newToken: string) {
    this.accessToken = newToken
    setAccesTokenToLS(newToken)
  }

  // Method để check token validity trước khi gọi API
  public hasValidToken(): boolean {
    return !!this.accessToken && this.accessToken.length > 0
  }
}

const http = new Http().instance
export default http

// Export class nếu cần sử dụng các methods khác
export { Http }
