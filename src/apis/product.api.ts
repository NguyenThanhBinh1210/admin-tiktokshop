import { Staff } from '~/components/Modal/CreateStaff'
import http from '~/utils/http'
import upload from '~/utils/upload'
import render from '~/utils/render'
import serverGet from '~/utils/serverGet'

export const getProduct = (params?: unknown) => serverGet.get('/product/get-all', { params })
export const getAllKey = () => serverGet.get('/key')
export const blockKey = (body: { key: string; code: string }) => http.post('/key/block-key', body)
export const removeKey = (body: { key: string }) => http.post('/key/delete-key', body)
export const searchKey = (username: string) => serverGet.get(`/user/auth/search?q=${username}`)
export const searchUser = (id: string) => serverGet.get(`/v1/user/search-staff?search=${id}`)
export const searchProduct = (title: string) => serverGet.get(`/v1/product/search?title=${title}`)
export const searchComment = (title: string) => serverGet.get(`/v1/comment/search?content=${title}`)
export const searchContact = (title: string) => serverGet.get(`/v1/contact/search?content=${title}`)
export const searchMessage = (title: string) => serverGet.get(`/v1/message/search?content=${title}`)
export const deleteContact = (body: string[]) =>
  http.post(`/v1/contact/delete`, {
    data: {
      id: body
    }
  })
export const deleteMessage = (body: string[]) =>
  http.post(`/v1/message/delete`,
    body
  )
export const deleteComment = (body: string[]) =>
  http.post(`/v1/comment/delete`, {
    data: {
      id: body
    }
  })
export const deleteStaff = (id: string, status: string, customer: string) =>
  render.post(`v1/user/${id}?luuVet=${status}&&customer=${customer}`)
export const createKey = (body: { date: number; username: string }) => http.post('key/create', body)
export const createStaff = (body: Staff) => http.post('v1/user/register-staff', body)
export const createCustommer = (body: Staff) => http.post('v1/auth/register', body)

export const createCategory = (body: any) => http.post('v1/category/create', body)
export const createProduct = (body: any) => http.post('v1/product/create', body)
export const updateStaff = (userId: string, body: any) => upload.patch(`v1/user/${userId}`, body)
export const updateOrderRandom = (userId: string,day:any, body: any) =>
  render.patch(`v1/random/update-order-day?userId=${userId}&&day=${day}`, body)

export const updateProduct = (id: string, body: any) => upload.patch(`v1/product/update/${id}`, body)
export const updateCategory = (id: string, body: any) => http.patch(`v1/category/update/${id}`, body)
export const getAllComment = (params?: unknown) => serverGet.get('/v1/comment/get-all-comment', { params })
// export const getAllComment = (params?: unknown) => serverGet.get('/v1/comment/get-all-comment', { params })
export const getAllContact = (params?: unknown) => serverGet.get('/v1/contact/get-all-contact', { params })
export const getAllCategory = (params?: unknown) => serverGet.get('/v1/category/get-category', { params })
export const getAllMessage = (params?: unknown) => serverGet.get('/v1/message/get-all-message', { params })
export const getAllProduct = (page:number,params?: unknown) => serverGet.get(`/v1/product/get-all-product?page=${page}`, { params })
export const updateProfile = (body: any) => upload.patch('/v1/user/update', body)
export const updateConfig = (body: { title: string; price: number; url_tele: string; content: string[] }) =>
  http.post('/config/update', body)
export const getAllStaff = (search: string, page: number, limit: number) => serverGet.get(`v1/user/get-all-user?search=${search}&&page=${page}`)
export const getAllAdmin = () => serverGet.get('v1/user/get-all-admin')
// export const getAllOrder = () => serverGet.get('v1/order/get-order?')
export const getAllOrder = (search: string, page: number) => serverGet.get(`v1/order/get-order?page=${page}&search=${search}`)
export const getAllOrderSpecial = (search: string, page: number) => serverGet.get(`v1/order/get-order-special?page=${page}&search=${search}`)

export const searchOrder = (id: string) => serverGet.get(`/v1/order/search?search=${id}`)
export const deleteOrder = (id: string) => http.post(`v1/order/delete/${id}`)
export const searchCategory = (name: string) => serverGet.get(`/v1/category/search?nameCategory=${name}`)
export const deleteProduct = (id: any, status: string, customer: string) =>
  http.post(`/v1/product/delete?id=${id}&&luuVet=${status}&&customer=${customer}`)
export const deleteCategory = (body: string[]) =>
  http.post(`/v1/category/delete`, {
    data: {
      id: body
    }
  })
export const deleteNoti = (id: string, status: string, customer: string) => http.post(`v1/noti/delete/${id}?luuVet=${status}&&customer=${customer}`)
export const deleteIp = (userId: string, status: string, customer: string) =>
  render.post(`v1/ip/delete?userId=${userId}&&luuVet=${status}&&customer=${customer}`)

export const deleteLuuVet = (userId: string) =>
  render.post(`v1/ip/delete-luulet?userId=${userId}`)
export const getAllNoti = () => serverGet.get('v1/noti/get-all')
export const createNoti = (body: Staff) => render.post('v1/noti/create', body)
export const repComment = (id: string, body: any) => render.post(`v1/comment/rep-comment`, body)
export const getProfile = () => serverGet.get('/v1/user/profile')

export const getAllIp = () => serverGet.get('v1/ip/get-all')
export const getAllLuuVet = (search: string) => serverGet.get(`v1/ip/get-all-luuvet?search=${search}`)
