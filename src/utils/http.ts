import axios, { type AxiosInstance } from 'axios'

import { getAccessTokenFromLS, setAccesTokenToLS, setProfileFromLS } from './auth'

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
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          console.log('this.accessToken', this.accessToken)
          config.headers['Authorization'] = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      if (url === '/v1/auth/login') {
        const dataProfile = response
        const newUser = dataProfile.data.user
        this.accessToken = response.data.token
        // this.refreshToken = response.data.refresh_token
        setProfileFromLS(newUser)
        setAccesTokenToLS(this.accessToken)
        // setRefreshTokenToLS(this.refreshToken)
      } else if (url === '/user/log-out') {
        // this.accessToken = ''
        // this.refreshToken = ''
        // clearLS()
      }
      return response
    })
  }
}

const http = new Http().instance

export default http
