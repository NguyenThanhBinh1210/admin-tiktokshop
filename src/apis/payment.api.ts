/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'
import render from '~/utils/render'
import serverGet from '~/utils/serverGet'

export const getPayment = () => serverGet.get('v1/payment-admin')
export const searchPayment = (name: string) => serverGet.get(`/v1/payment/search?bankName=${name}`)
export const deletePayment = (id: string) => http.post(`v1/payment-admin/delete?id=${id}`)
export const updatePayment = (id: string, body: any) =>
  http.patch(`v1/payment-admin/setting-pay-admin?id=${id}`, body)
export const createPayment = (body: any) => http.post('v1/payment-admin/create', body)

export const AllHistory = (params: any) => serverGet.get('/v1/wallet/all-history', { params })
export const UpdateWalletHistory = (id: any, body: any) => {
  return render.patch(`/v1/wallet/update-all-history?id=${id}`, body)
}

export const UpdateOrdertHistory = (id: any, complete: string, luuVet: string, customer: string) => {
  return render.patch(`/v1/order/update-order-user/${id}?luuVet=${luuVet}&&customer=${customer}`, { complete })
}

export const UpdateHistory = (id: any, body: any) => render.patch(`/v1/wallet/update-history?id=${id}`, body)
export const deleteHistory = (id: any, status: string, customer: string) =>
  render.post(`/v1/wallet/delete-history?id=${id}&&luuVet=${status}&&customer=${customer}`)
