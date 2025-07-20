import http from "~/utils/http";

export const deleteProducts = (id: any, status: string, customer: string) =>
    http.post(`/v1/product/delete-set-product?id=${id}&&luuVet=${status}&&customer=${customer}`)
export const getAllProducts = (params?: { page?: number; limit?: number }) =>
    http.get('/v1/product/get-all-product-set-order', { params })
export const searchProducts = (username: any) => {
    let query = ''
    if (username) {
        query = `username=${username}`
    }
    return http.get(`/v1/product/searchs?${query}`)
}
export const createProducts = (body: any) => http.post('v1/product/create-product-set-order', body)
