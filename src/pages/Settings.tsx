import { Content } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import {
  getCountDown,
  getTiso,
  updateCountDown,
  updateTiso,
  updateRandomProduct,
  updateRandomFaction,
  updateRandomClient,
  getRandomClient,
  getRandomProduct,
  getRandomFaction,
  getGioiHan,
  updateGioiHan,
  updateStartPoint,
  getStartPoint,
  updateCFMess,
  getCFMess,
  getTime,
  updateTime,
  updateGioiHanThem,
  getGioiHanThem,
  updateCommission,
  getCommission,
  getNewbiePercentage,
  updateNewbiePercentage,
  getOrderCommission,
  updateOrderCommission,
  getReferralPercentage,
  updateReferralPercentage,
  getNewcomerCommission,
  updateNewcomerCommission,
  getNumberOrder,
  updateNumberOrder,
  getOrderPercentage,
  updateOrderPercentage
} from '~/apis/setting.api'
import Dropdown from '../components/Dropdown/Dropdown'

const Settings = () => {
  const [cowndown, setCoundown] = useState<any>()
  const [message, setMessage] = useState<any>()
  const [tiso, setTiso] = useState<any>()
  const [commission, setCommission] = useState<any>()
  const [show, setShow] = useState<boolean>(false)
  const [show1, setShow1] = useState<boolean>(false)
  const [show2, setShow2] = useState<boolean>(false)
  const [showMess, setShowMess] = useState<boolean>(false)
  const [show3, setShow3] = useState<boolean>(false)
  const [show4, setShow4] = useState<boolean>(false)
  const [show5, setShow5] = useState<boolean>(false)
  const [show6, setShow6] = useState<boolean>(false)
  const [show7, setShow7] = useState<boolean>(false)
  const [show8, setShow8] = useState<boolean>(false)
  const [show9, setShow9] = useState<boolean>(false)

  const [client, setClient] = useState<any>()
  const [gioihan, setGioihan] = useState<any>()
  const [gioihanthem, setGioihanThem] = useState<any>()
  const [newcomer, setNewcomer] = useState<any>()
  const [newcomerCommission, setNewcomerCommissions] = useState<any>()
  const [percent, setpercent] = useState<any>()
  const [orderCommission, setOrderCommission] = useState<any>()
  const [faction, setFaction] = useState<any>()
  const [point, setPoint] = useState<any>()
  const [time, setTime] = useState<any>()
  const [selectedOption, setSelectedOption] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [numberOrder, setNumberOrder] = useState<any>()
  const [orderPercentage, setOrderPercentage] = useState<any>()

  // Component for input field with confirmation button
  const InputWithConfirm = ({ 
    label, 
    value, 
    onChange, 
    onConfirm, 
    showConfirm, 
    placeholder = "0", 
    type = "number",
    suffix = "",
    className = ""
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <input
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
              transition-all duration-200 ${className}`}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
        {showConfirm && (
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 
              shadow-lg hover:shadow-xl"
          >
            Xác nhận
          </button>
        )}
      </div>
    </div>
  )

  // Component for textarea with confirmation
  const TextareaWithConfirm = ({ 
    label, 
    value, 
    onChange, 
    onConfirm, 
    showConfirm, 
    placeholder = "Nhập nội dung...",
    rows = 4
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="space-y-3">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
            resize-none transition-all duration-200"
        />
        {showConfirm && (
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 
              shadow-lg hover:shadow-xl"
          >
            Xác nhận
          </button>
        )}
      </div>
    </div>
  )

  // All the existing useQuery and mutation logic here...
  const { refetch: refetchCommission } = useQuery({
    queryKey: ['get-setting-faction'],
    queryFn: () => getCommission(),
    onSuccess: (data) => setCommission(data.data)
  })

  const mutationUpdateCommission = useMutation((body: any) => updateCommission(body))

  // Newcomer queries
  useQuery({
    queryKey: ['get-setting-newcomer'],
    queryFn: () => getNewbiePercentage(),
    onSuccess: (data) => setNewcomer(data.data.ratio)
  })

  const mutationUpdateNewcomer = useMutation((body: any) => updateNewbiePercentage(body))

  // All other queries and mutations...
  useQuery({
    queryKey: ['get-setting-newcomer-commission'],
    queryFn: () => getNewcomerCommission(),
    onSuccess: (data) => setNewcomerCommissions(data.data.money)
  })

  useQuery({
    queryKey: ['get-setting-order-commission'],
    queryFn: () => getOrderCommission(),
    onSuccess: (data) => setOrderCommission(data.data.ratio)
  })

  useQuery({
    queryKey: ['get-setting-order-Referral-Percentage'],
    queryFn: () => getReferralPercentage(),
    onSuccess: (data) => setpercent(data.data.ratio)
  })

  useQuery({
    queryKey: ['get-setting-number-order'],
    queryFn: () => getNumberOrder(),
    onSuccess: (data) => setNumberOrder(data.data.number)
  })

  useQuery({
    queryKey: ['get-setting-order-Percentage'],
    queryFn: () => getOrderPercentage(),
    onSuccess: (data) => setOrderPercentage(data.data.ratio)
  })

  useQuery({
    queryKey: ['get-cf-message'],
    queryFn: () => getCFMess(),
    onSuccess: (data) => setMessage(data.data[0].content)
  })

  useQuery({
    queryKey: ['get-setting-time'],
    queryFn: () => getTime(),
    onSuccess: (data) => setTime(data.data.time)
  })

  // All existing mutation functions...
  const mutationUpdateNewcomerCommission = useMutation((body: any) => updateNewcomerCommission(body))
  const mutationUpdateOrderCommission = useMutation((body: any) => updateOrderCommission(body))
  const mutationUpdateReferralPercentage = useMutation((body: any) => updateReferralPercentage(body))
  const mutationUpdateNumberOrder = useMutation((body: any) => updateNumberOrder(body))
  const mutationUpdateOrderPercentage = useMutation((body: any) => updateOrderPercentage(body))
  const mutationUpdateMess = useMutation((body: any) => updateCFMess(body))
  const mutationUpdateTime = useMutation((body: any) => updateTime(body))

  // All existing handler functions...
  const handleUpdateNewComer = () => {
    const body = {
      ratio: newcomer,
      activate: `cấu hình Tỉ lệ hoa hồng người mới với ${newcomer}%`,
      nameUser: ''
    }
    mutationUpdateNewcomer.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật tỉ lệ người mới thành công ')
        setShow3(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateNewcomerCommission = () => {
    const body = {
      money: newcomerCommission,
      activate: `Giới hạn để nhận hoa hồng với người mới với ${newcomerCommission}%`,
      nameUser: ''
    }
    mutationUpdateNewcomerCommission.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật hoa hồng người mới thành công ')
        setShow7(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateOrderCommission = () => {
    const body = {
      ratio: orderCommission,
      activate: `Tỉ lệ % hoa hồng giới thiệu / 1 người (%) ${orderCommission}%`,
      nameUser: ''
    }
    mutationUpdateOrderCommission.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật % hoa hồng giới thiệu thành công ')
        setShow5(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateReferralPercentage = () => {
    const body = {
      ratio: percent,
      activate: `cấu hình Hoa hồng / đơn hàng (%) với ${percent}%`,
      nameUser: ''
    }
    mutationUpdateReferralPercentage.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật Hoa hồng / đơn hàng (%) thành công ')
        setShow6(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateNumberOrder = () => {
    const body = {
      number: numberOrder,
      activate: `Số lượng đơn hàng được order trong 1 ngày ${numberOrder}`,
      nameUser: ''
    }
    mutationUpdateNumberOrder.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật số lượt order thành công ')
        setShow8(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateOrderPercentage = () => {
    const body = {
      ratio: orderPercentage,
      activate: `cấu hình phần trăm số tiền tối thiểu mỗi lần khách hàng order ${orderPercentage}%`,
      nameUser: ''
    }
    mutationUpdateOrderPercentage.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật phần trăm order thành công ')
        setShow9(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateMess = () => {
    const body = {
      content: message,
      activate: `Cấu hình tin nhắn`,
      nameUser: ''
    }
    mutationUpdateMess.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật nội dung thông báo tin nhắn thành công!')
        setShowMess(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  const handleUpdateTime = () => {
    const body = {
      time: time,
      activate: `Thời gian đếm ngược đơn hàng ${time} (phút)`,
      nameUser: ''
    }
    mutationUpdateTime.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật thời gian thành công ')
        setShow2(false)
      },
      onError: () => toast.warning('Lỗi, hãy thử lại!')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý cấu hình và thông số hệ thống
          </p>
        </div>

        {/* Commission Settings Section */}
        {/* <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            Cài Đặt Hoa Hồng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputWithConfirm
              label="Tỉ lệ hoa hồng người mới (%)"
              value={newcomer}
              onChange={(e) => {
                setNewcomer(e.target.value)
                setShow3(true)
              }}
              onConfirm={handleUpdateNewComer}
              showConfirm={show3}
              suffix="%"
            />

            <InputWithConfirm
              label="Giới hạn để nhận hoa hồng với người mới"
              value={newcomerCommission}
              onChange={(e) => {
                setNewcomerCommissions(e.target.value)
                setShow7(true)
              }}
              onConfirm={handleUpdateNewcomerCommission}
              showConfirm={show7}
              suffix="$"
            />

            <InputWithConfirm
              label="Tỉ lệ % hoa hồng giới thiệu / 1 người (%)"
              value={orderCommission}
              onChange={(e) => {
                setOrderCommission(e.target.value)
                setShow5(true)
              }}
              onConfirm={handleUpdateOrderCommission}
              showConfirm={show5}
              suffix="%"
            />

            <InputWithConfirm
              label="Hoa hồng / đơn hàng (%)"
              value={percent}
              onChange={(e) => {
                setpercent(e.target.value)
                setShow6(true)
              }}
              onConfirm={handleUpdateReferralPercentage}
              showConfirm={show6}
              suffix="%"
            />
          </div>
        </div> */}

        {/* Order Settings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
            Cài Đặt Đơn Hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputWithConfirm
              label="Số lượng đơn hàng được order trong 1 ngày"
              value={numberOrder}
              onChange={(e) => {
                setNumberOrder(e.target.value)
                setShow8(true)
              }}
              onConfirm={handleUpdateNumberOrder}
              showConfirm={show8}
              placeholder="Số lượng"
            />

            <InputWithConfirm
              label="Phần trăm số tiền tối thiểu mỗi lần order (%)"
              value={orderPercentage}
              onChange={(e) => {
                setOrderPercentage(e.target.value)
                setShow9(true)
              }}
              onConfirm={handleUpdateOrderPercentage}
              showConfirm={show9}
              suffix="%"
            />

            {/* <InputWithConfirm
              label="Thời gian đếm ngược đơn hàng (phút)"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
                setShow2(true)
              }}
              onConfirm={handleUpdateTime}
              showConfirm={show2}
              suffix="phút"
            /> */}
          </div>
        </div>

        {/* Message Configuration Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
            Cấu Hình Tin Nhắn
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <TextareaWithConfirm
              label="Nội dung tin nhắn thông báo"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setShowMess(true)
              }}
              onConfirm={handleUpdateMess}
              showConfirm={showMess}
              placeholder="Nhập nội dung tin nhắn..."
              rows={5}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Các thay đổi sẽ được áp dụng ngay lập tức sau khi xác nhận
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
