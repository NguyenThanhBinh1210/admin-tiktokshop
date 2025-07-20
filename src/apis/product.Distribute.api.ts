/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'
import serverGet from '~/utils/serverGet'

export const createProduct = (body: any) => http.post(`/v1/distribute-product/create-by-admin`, body)
export const deleteProduct = (body: any) => http.post(`/v1/distribute-product/delete`, body)

export const blockProduct = (body: any) => http.post(`/v1/distribute-product/block`, body)

export const addCustomer = (body: any) => http.post(`/v1/distribute-product/add-customer`, body)
export const removeCustomer = (body: any) => http.post(`/v1/distribute-product/remote-customer`, body)

export const getAllUserSearch = (search: any, page: any) => serverGet.get(`/v1/distribute-product/get-all-user?search=${search}&&page=${page}`)
export const getProductByClick = (slug: any) => serverGet.get(`/v1/distribute-product/get-product-by-user?slug=${slug}`)
export const getProductById = (id: any,page: any) => serverGet.get(`/v1/distribute-product/get-by-id?idUser=${id}&&page=${page}`)

export const getDistributedProduct = (search: any) =>
  serverGet.get(`/v1/distribute-product/get-product-by-shop?productId=${search}`)

export const getProductByUser = (page: any) => serverGet.get(`/v1/distribute-product/get-by-user?page=${page}`)
export const buyProduct = (body: any) => http.post(`/v1/distribute-product/buy-product`, body)

export const getHistoryByUser = (page: any) => serverGet.get(`/v1/distribute-product/get-history-order-user?page=${page}`)
export const getHistoryByStore = (page: any) => serverGet.get(`/v1/distribute-product/get-history-order-store?page=${page}`)
