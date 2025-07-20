import http from '~/utils/http'
import serverGet from '~/utils/serverGet';

export const changeStatusPurchase = (id: string, body: { product_id: string; purchase_id: string; status: number }) => {
  return http.put(`/purchase/confirm-purchase/${id}`, body)
}
export const getUserSupend = () => {
  return serverGet.get(`/purchase/get-user-supend`)
}
export const getMoneyByWeek = () => {
  return serverGet.get(`/purchase/get-money`)
}

export const deletePurchase = (id: string, purchaseIds: string[]) => {
  return http.post<{ deleted_count: number }>(`/purchase/delete-purchase/${id}`, {
    data: purchaseIds
  })
}
