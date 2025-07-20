import http from '~/utils/http'
import serverGet from '~/utils/serverGet'
import mess from '~/utils/mess'
import upload from '~/utils/upload'
export const getAllChat = (page: number, params: any) => mess.get(`/v1/message/get-all-message?page=${page}`, { params })
export const createMessage = (body: any) => mess.post('/v1/message/create', body)
export const checkView = (userId: string, body: any) => http.patch(`/v1/message/check-view/${userId}`, body)
export const getMessages = (limit: any, skip: any, receiver: string) =>
    mess.get(`/v1/message/get-message?limit=${limit}&&skip=${skip}&&sender=${receiver}`)
export const uploadImage = (body: any) => upload.post('/v1/message/upload', body)
export const getCountChat = () => mess.get('/v1/message/get-count-message')