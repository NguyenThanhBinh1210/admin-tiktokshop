/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'
import serverGet from '~/utils/serverGet'

export const createRandom = () => serverGet.get('/v1/random/create')
export const getOrderDay = (id:any, day:any) => serverGet.get(`/v1/random/order-day-admin?id=${id}&&day=${day}`)
