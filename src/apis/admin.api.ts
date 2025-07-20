/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'
import render from '~/utils/render'
import serverGet from '~/utils/serverGet'
import upload from '~/utils/upload'
// import serverGet from '~/utils/http'
// Product
export const deleteProduct = (id: unknown) => http.post(`/product/delete/${id}`)
export const addProduct = (product?: any) => http.post(`/product/create/`, product)
export const getProduct = (id: unknown) => serverGet.get(`/product/get-details/${id}`)
export const updateProduct = (id: unknown, params: any) => http.put(`/product/update/${id}`, params)

export const createRecharge = (body: any) => http.post(`/v1/wallet/add`, body)
export const truRecharge = (body: any) => http.post(`/v1/wallet/tru`, body)
export const addMoney = (body: any) => http.post(`/v1/wallet/add-money`, body)
export const minusMoney = (body: any) => http.post(`/v1/wallet/minus-money`, body)
export const addFreeze = (body: any) => http.post(`/v1/wallet/freeze-add`, body)

export const minusFreeze = (body: any) => http.post(`/v1/wallet/freeze-open`, body)

// export const getRecharges = (params: any) => serverGet.get(`/v1/wallet/all-history`, { params })
// export const getWithrowRecharges = (params: any) => serverGet.get(`/v1/wallet/admin-all-history`, { params })
// export const getWithdrawMoney = (params: any) => serverGet.get(`/v1/wallet/all-add-money`, { params 
export const getRecharges = (search: string, page: number, type: string) => serverGet.get(`/v1/wallet/all-history?search=${search}&&page=${page}&&type=${type}`)
export const getWithrowRecharges = (params: any) => serverGet.get(`/v1/wallet/admin-all-history`, { params })
export const getWithdrawMoney = (search: any) => serverGet.get(`/v1/wallet/all-add-money?search=${search}`)
export const getAllInOne = () => serverGet.get(`/v1/wallet/all-inf`)
export const updateBank = (id: string, body: any) => http.patch(`/v1/payment/update/${id}`, body)
export const updateUser = (id: string, body: any) => render.patch(`/v1/user/${id}`, body)

export const updateTruoc = (id: string, body: any) => upload.patch(`/v1/user/update-frontimage/${id}`, body)
export const updateSau = (id: string, body: any) => upload.patch(`/v1/user/update-backimage/${id}`, body)
export const updateChanDung = (id: string, body: any) => upload.patch(`/v1/user/update-portrait/${id}`, body)
