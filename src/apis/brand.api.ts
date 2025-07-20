import http from '~/utils/http'
import serverGet from '~/utils/serverGet'

export const getAllBrand = (params?: unknown) => serverGet.get('/v1/brand/get-brand', { params })
export const createBrand = (body: any) => http.post('v1/brand/create', body)
export const updateBrand = (id: string, body: any) => http.patch(`v1/brand/update/${id}`, body)
export const searchBrand = (name: string) => serverGet.get(`/v1/brand/search?nameBrand=${name}`)
export const deleteBrand = (body: string[]) =>
  http.post(`/v1/brand/delete`, {
    data: {
      id: body
    }
  })
