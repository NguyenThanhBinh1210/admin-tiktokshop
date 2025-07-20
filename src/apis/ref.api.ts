import http from '~/utils/http'
import serverGet from '~/utils/serverGet'

export const getAllRef = (page: any) => serverGet.get(`/v1/ref/refs-all?page=${page}`)
export const createRef = (body: any) => http.post('v1/ref/create', body)
export const updateRef = (id: string, body: any) => http.patch(`v1/ref/update/${id}`, body)
export const searchRef = (name: string) => serverGet.get(`/v1/ref/search?nameRef=${name}`)
export const deleteRef = (id: any) => http.post(`/v1/ref/delete?id=${id}`)
