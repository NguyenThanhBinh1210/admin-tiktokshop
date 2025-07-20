export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ResponseApi<Data> {
  refresh_token?: string
  access_token?: string
  status: string
  message: string
  data?: Data
}
