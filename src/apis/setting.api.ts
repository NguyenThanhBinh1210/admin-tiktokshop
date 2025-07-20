/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'
import serverGet from '~/utils/serverGet'

// Product
export const getCountDown = () => serverGet.get(`/v1/config-transition/get-countdown`)
export const updateCountDown = (body: any) => http.patch(`/v1/config-transition/setting-countdown`, body)
export const updateCFMess = (body: any) => http.patch(`/v1/config-message/update`, body)
export const getCFMess = () => serverGet.get(`/v1/config-message/get-all`)
export const getTiso = () => serverGet.get(`/v1/config-transition/get`)
export const updateTiso = (body: any) => http.patch(`/v1/config/update`, body)
export const updateGioiHan = (body: any) => http.patch(`/v1/config/update-withdraw`, body)
export const updateGioiHanThem = (body: any) => http.patch(`/v1/config/update-add`, body)

export const updateStartPoint = (body: any) => http.patch(`/v1/config-transition/update-config-point`, body)
export const getStartPoint = () => serverGet.get(`/v1/config-transition/get-config-point`)

export const updateRandomProduct = (body: any) => http.patch(`/v1/code-random/setting-random-product`, body)
export const getRandomProduct = () => serverGet.get(`/v1/code-random/get-setting-random-product`)

export const updateRandomClient = (body: any) => http.patch(`/v1/code-random/setting-random-client`, body)
export const getRandomClient = () => serverGet.get(`/v1/code-random/get-setting-random-client`)

export const updateRandomFaction = (body: any) => http.patch(`/v1/code-random/setting-random-faction`, body)
export const getRandomFaction = () => serverGet.get(`/v1/code-random/get-setting-random-faction`)
export const getGioiHan = () => serverGet.get(`/v1/config/get-withdraw`)
export const getCommission = () => serverGet.get(`/v1/config/get-commission`)
export const updateCommission = (body: any) => http.patch(`/v1/config/setting-commission`, body)

export const getGioiHanThem = () => serverGet.get(`/v1/config/get-add`)

export const getTime = () => serverGet.get(`/v1/config/get-time`)
export const updateTime = (body: any) => http.patch(`/v1/config/setting-time`, body)

export const getNewbiePercentage = () => serverGet.get(`/v1/config/get-newbie-percentage`)
export const updateNewbiePercentage = (body: any) => http.patch(`/v1/config/setting-newbie-percentage`, body)

export const getOrderCommission = () => serverGet.get(`/v1/config/get-order-commission`)
export const updateOrderCommission = (body: any) => http.patch(`/v1/config/setting-order-commission`, body)

export const getReferralPercentage = () => serverGet.get(`/v1/config/get-referral-percentage`)
export const updateReferralPercentage = (body: any) => http.patch(`/v1/config/setting-referral-percentage`, body)

export const getNewcomerCommission = () => serverGet.get(`/v1/config/get-newcomer-commission`)
export const updateNewcomerCommission = (body: any) => http.patch(`/v1/config/setting-newcomer-commission`, body)

export const getNumberOrder = () => serverGet.get(`/v1/config/get-number-order`)
export const updateNumberOrder = (body: any) => http.patch(`/v1/config/setting-number-order`, body)

export const getOrderPercentage = () => serverGet.get(`/v1/config/get-order-percentage`)
export const updateOrderPercentage = (body: any) => http.patch(`/v1/config/setting-order-percentage`, body)

