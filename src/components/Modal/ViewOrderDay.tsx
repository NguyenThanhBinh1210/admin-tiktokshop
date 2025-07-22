/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { updateOrderRandom } from '~/apis/product.api'
import { getOrderDay } from '~/apis/random.api'
import { formatCurrency } from '~/utils/utils'

// 1) Import DatePicker
import { DatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import { io } from 'socket.io-client'
import { getNumberOrder } from '~/apis/setting.api'

interface Props {
  isOpen: boolean
  onClose: () => void
  data: any
}
const serverUrl = 'https://socket.ordersdropship.com';

const ViewOrderDay = ({ isOpen, onClose, data }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [commission, setCommission] = useState<number>(0)
  const [numberOder, setNumberOder] = useState<number>(0)

  // Mặc định hôm nay
  const getVietnamToday = () => {
    const now = new Date()
    // Chuyển về múi giờ Việt Nam (UTC+7)
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000))
    return vietnamTime.toISOString().split('T')[0]
  }

  const today = getVietnamToday()
  const [day, setDay] = useState<string>(today)
  const [numberOderSetting, setNumberOderSetting] = useState<number>(0)
  const [numberOrder, setNumberOrder] = useState<number>(0)
  console.log("numberOderSetting", numberOderSetting);
  const [orderList, setOrderList] = useState<
    Array<{ productId: string; refillOrder: string; quantity: number; price?: number; ratio?: number }>
  >([])
  const numberOrderDay = !numberOderSetting && numberOder > numberOrder ? numberOrder : numberOderSetting && numberOder > numberOderSetting ? numberOderSetting : numberOder
  const mutationUpdateBank = useMutation((body: any) => {
    return updateOrderRandom(data._id, day, body)
  })

  // Gọi getOrderDay
  useQuery(
    ['orderDay', data._id, day],
    () => getOrderDay(data._id, day),
    {
      keepPreviousData: true,
      enabled: !!data?._id,
      onSuccess: (orderDayData) => {
        console.log("orderDayData.data.numberOder", orderDayData.data);
        setCommission(orderDayData?.data.orderDay.commission || 0)
        setNumberOder(orderDayData?.data.orderDay.numberOder || 0)
        setNumberOderSetting(orderDayData?.data.orderDay.numberOderSetting || 0)

        if (orderDayData?.data.orders?.length > 0) {
          setOrderList(
            orderDayData.data.orders.map((item: any) => ({
              productId: item.productId ?? '',
              refillOrder: item.refillOrder ?? '',
              quantity: item.quantity ?? 1,

              price: item.price ?? 0,
              ratio: item.ratio ?? 0
            }))
          )
        } else {
          setOrderList([{ productId: '', refillOrder: '', quantity: 1 }])
        }
      }
    }
  )
  useQuery({
    queryKey: ['get-setting-number-order'],
    queryFn: () => {
      return getNumberOrder()
    },
    onSuccess: (data) => {
      setNumberOrder(data.data.number)
    }
  })
  useQuery(
    ['numberOrderDay', data._id, day],
    () => getOrderDay(data._id, day),
    {
      keepPreviousData: true,
      enabled: !!data?._id,
      onSuccess: (orderDayData) => {
        setNumberOderSetting(orderDayData?.data.orderDay.numberOderSetting || '')
      }
    }
  )
  useEffect(() => {
    setTotalAmount(data?.totalAmount ?? '')
  }, [data])
  console.log("object", numberOder);
  // Đóng modal khi click ra ngoài
  const handleModalClick = (e: React.MouseEvent) => {
    // Kiểm tra click ra ngoài modal => đóng
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleChangeOrderRow = (
    index: number,
    field: 'productId' | 'refillOrder' | 'quantity' | 'price' | 'ratio',
    value: string | number
  ) => {
    setOrderList((prev) => {
      const newArr = [...prev]
      if (field === 'quantity') {
        newArr[index].quantity = Number(value)
      } else if (field === 'price') {
        newArr[index].price = Number(value)
      } else if (field === 'ratio') {
        newArr[index].ratio = Number(value)
      } else {
        newArr[index][field] = String(value)
      }
      return newArr
    })
  }

  const handleAddOrderRow = () => {
    setOrderList((prev) => [...prev, { productId: '', refillOrder: '', quantity: 1 }])
  }

  const handleRemoveOrderRow = (index: number) => {
    setOrderList((prev) => prev.filter((_, i) => i !== index))
  }

  // Chọn ngày
  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDay(dateString)
  }

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const chosenDate = new Date(day)         // user chọn
    // const nowDate = new Date()              // bây giờ
    const isoToday = new Date(today)        // today => 00:00 (thường)

    // Nếu chosenDate < isoToday => không cho update
    if (chosenDate < isoToday) {
      toast.error('Không thể update cho ngày đã qua.')
      return
    }
    const body = {
      nameUser: data.username,
      day,
      orders: orderList,
      numberOderSetting,
      activate: `Đã thiết lập nhiều đơn cho ${data.username}`
    }
    mutationUpdateBank.mutate(body, {
      onSuccess: () => {
        toast.success('Thay đổi thông tin thành công!')
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        onClose()
      }
    })
  }
  useEffect(() => {
    const socket = io(serverUrl);
    socket.on('getCountRandom', () => {
      console.log("chekss");
      queryClient.invalidateQueries({ queryKey: ['numberOrderDay', data._id, day] });
    });

  }, []);
  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={handleModalClick}
      className={`
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} 
        fixed inset-0 z-50 bg-[#02020246] dark:bg-[#ffffff46]
        transition-all p-2 sm:p-4
      `}
    >
      {/* Modal Container - Responsive */}
      <div
        ref={modalRef}
        className='relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
          h-[95vh] sm:h-[90vh]
          bg-white dark:bg-gray-700 rounded-lg shadow-lg
          flex flex-col
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      >
        {/* Header - Fixed at top */}
        <div className='flex-shrink-0 relative px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600'>
          <h3 className='text-lg sm:text-xl font-medium text-gray-900 dark:text-white pr-8'>
            Thiết lập đơn theo ngày {day}
          </h3>
          <button
            onClick={onClose}
            type='button'
            className='absolute top-3 right-3 text-gray-400 bg-transparent 
              hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8
              inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
          >
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
              />
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4'>
          {/* Date Picker */}
          <div
            className='mb-4'
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape') e.stopPropagation() }}
            role="button"
            tabIndex={0}
          >
            <label htmlFor="date-picker" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Chọn ngày (mặc định hôm nay)
            </label>
            <DatePicker
              id="date-picker"
              onChange={onDateChange}
              className='w-full'
              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            />
          </div>

          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Thông tin cơ bản - Grid responsive */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Số tiền trong ví */}
              <div>
                <label
                  htmlFor='wallet'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Số tiền trong ví
                </label>
                <input
                  disabled
                  type='text'
                  id='wallet'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                    rounded-lg block w-full p-2.5 dark:bg-gray-600 
                    dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  value={formatCurrency(totalAmount)}
                />
              </div>

              {/* Lợi nhuận ngày */}
              <div>
                <label
                  htmlFor='profit'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Lợi nhuận ngày
                </label>
                <input
                  disabled
                  type='text'
                  id='profit'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                    rounded-lg block w-full p-2.5 dark:bg-gray-600 
                    dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  value={formatCurrency(commission)}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Số lượt order ngày */}
              <div>
                <label
                  htmlFor='order-today'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Số lượt order ngày
                </label>
                <input
                  disabled
                  type='text'
                  id='order-today'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                    rounded-lg block w-full p-2.5 dark:bg-gray-600 
                    dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  value={numberOrderDay}
                />
              </div>

              {/* Thiết lập số đơn */}
              <div>
                <label
                  htmlFor='phone'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Thiết lập số đơn
                </label>
                <input
                  type='number'
                  name='phone'
                  id='phone'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                    rounded-lg block w-full p-2.5 dark:bg-gray-600 
                    dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={numberOderSetting}
                  onChange={(e) => setNumberOderSetting(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Thiết lập nhiều đơn - Responsive table */}
            <div className='border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4'>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 font-bold'>
                Thiết lập nhiều đơn
              </p>

              {/* Desktop/Tablet View - Hidden on small screens */}
              <div className='hidden md:block'>
                <div className='grid grid-cols-6 gap-2 mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>
                  <div>Mã đơn</div>
                  <div>Đơn thứ</div>
                  <div>Số lượng</div>
                  <div>Số tiền</div>
                  <div>% Lợi nhuận</div>
                  <div>Thao tác</div>
                </div>

                {orderList.map((orderItem, index) => (
                  <div key={index} className='grid grid-cols-6 gap-2 mb-3'>
                    <input
                      type='text'
                      className='bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg block w-full p-2
                        dark:bg-gray-600 dark:border-gray-500 
                        dark:placeholder-gray-400 dark:text-white'
                      placeholder='Mã đơn'
                      value={orderItem.productId}
                      onChange={(e) =>
                        handleChangeOrderRow(index, 'productId', e.target.value)
                      }
                    />
                    <input
                      type='number'
                      className='bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg block w-full p-2
                        dark:bg-gray-600 dark:border-gray-500 
                        dark:placeholder-gray-400 dark:text-white'
                      placeholder='Đơn thứ'
                      value={orderItem.refillOrder}
                      onChange={(e) =>
                        handleChangeOrderRow(index, 'refillOrder', e.target.value)
                      }
                    />
                    <input
                      type='number'
                      className='bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg block w-full p-2
                        dark:bg-gray-600 dark:border-gray-500 
                        dark:placeholder-gray-400 dark:text-white'
                      placeholder='Số lượng'
                      value={orderItem.quantity}
                      onChange={(e) =>
                        handleChangeOrderRow(index, 'quantity', +e.target.value)
                      }
                    />
                    <input
                      type='number'
                      className='bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg block w-full p-2
                        dark:bg-gray-600 dark:border-gray-500 
                        dark:placeholder-gray-400 dark:text-white'
                      placeholder='Số tiền'
                      value={orderItem.price}
                      onChange={(e) =>
                        handleChangeOrderRow(index, 'price', +e.target.value)
                      }
                    />
                    <input
                      type='number'
                      className='bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg block w-full p-2
                        dark:bg-gray-600 dark:border-gray-500 
                        dark:placeholder-gray-400 dark:text-white'
                      placeholder='% Lợi nhuận'
                      value={orderItem.ratio}
                      onChange={(e) =>
                        handleChangeOrderRow(index, 'ratio', +e.target.value)
                      }
                    />
                    {orderList.length > 1 && (
                      <button
                        type='button'
                        onClick={() => handleRemoveOrderRow(index)}
                        className='bg-red-500 text-white text-xs px-2 py-1 
                          rounded-md hover:bg-red-600 h-fit'
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile View - Visible on small screens */}
              <div className='md:hidden space-y-4'>
                {orderList.map((orderItem, index) => (
                  <div key={index} className='border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Đơn hàng #{index + 1}
                      </span>
                      {orderList.length > 1 && (
                        <button
                          type='button'
                          onClick={() => handleRemoveOrderRow(index)}
                          className='bg-red-500 text-white text-xs px-2 py-1 
                            rounded-md hover:bg-red-600'
                        >
                          Xoá
                        </button>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-xs text-gray-700 dark:text-gray-400 mb-1'>
                          Mã đơn
                        </label>
                        <input
                          type='text'
                          className='bg-gray-50 border border-gray-300 
                            text-gray-900 text-sm rounded-lg block w-full p-2
                            dark:bg-gray-600 dark:border-gray-500 
                            dark:placeholder-gray-400 dark:text-white'
                          placeholder='Nhập mã đơn'
                          value={orderItem.productId}
                          onChange={(e) =>
                            handleChangeOrderRow(index, 'productId', e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className='block text-xs text-gray-700 dark:text-gray-400 mb-1'>
                          Đơn thứ
                        </label>
                        <input
                          type='number'
                          className='bg-gray-50 border border-gray-300 
                            text-gray-900 text-sm rounded-lg block w-full p-2
                            dark:bg-gray-600 dark:border-gray-500 
                            dark:placeholder-gray-400 dark:text-white'
                          placeholder='VD: 1, 2,...'
                          value={orderItem.refillOrder}
                          onChange={(e) =>
                            handleChangeOrderRow(index, 'refillOrder', e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className='block text-xs text-gray-700 dark:text-gray-400 mb-1'>
                          Số lượng
                        </label>
                        <input
                          type='number'
                          className='bg-gray-50 border border-gray-300 
                            text-gray-900 text-sm rounded-lg block w-full p-2
                            dark:bg-gray-600 dark:border-gray-500 
                            dark:placeholder-gray-400 dark:text-white'
                          placeholder='VD: 1, 2,...'
                          value={orderItem.quantity}
                          onChange={(e) =>
                            handleChangeOrderRow(index, 'quantity', +e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className='block text-xs text-gray-700 dark:text-gray-400 mb-1'>
                          Số tiền
                        </label>
                        <input
                          type='number'
                          className='bg-gray-50 border border-gray-300 
                            text-gray-900 text-sm rounded-lg block w-full p-2
                            dark:bg-gray-600 dark:border-gray-500 
                            dark:placeholder-gray-400 dark:text-white'
                          placeholder='Nhập số tiền'
                          value={orderItem.price}
                          onChange={(e) => handleChangeOrderRow(index, 'price', +e.target.value)}
                        />
                      </div>

                      <div className='col-span-2'>
                        <label className='block text-xs text-gray-700 dark:text-gray-400 mb-1'>
                          Phần trăm lợi nhuận
                        </label>
                        <input
                          type='number'
                          className='bg-gray-50 border border-gray-300 
                            text-gray-900 text-sm rounded-lg block w-full p-2
                            dark:bg-gray-600 dark:border-gray-500 
                            dark:placeholder-gray-400 dark:text-white'
                          placeholder='VD: 10, 15,...'
                          value={orderItem.ratio}
                          onChange={(e) => handleChangeOrderRow(index, 'ratio', +e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type='button'
                onClick={handleAddOrderRow}
                className='text-blue-600 dark:text-blue-400 text-sm hover:underline mt-3'
              >
                + Thêm mã đơn
              </button>
            </div>

            {/* Lưu ý */}
            <div className='space-y-2 text-sm'>
              <p className='text-red-600 dark:text-red-400'>
                <span className='font-medium'>Lưu ý:</span> Vui lòng nhập mã sản phẩm có giá lớn hơn tiền trong ví
              </p>

              <p className='text-gray-500 dark:text-gray-400'>
                Mọi thiết lập sẽ tự reset sau 0h
              </p>
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className='flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-600'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='w-full text-white bg-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:outline-none focus:ring-blue-300 
              font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
              transition-colors duration-200'
          >
            {mutationUpdateBank.isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  aria-hidden='true'
                  role='status'
                  className='inline w-4 h-4 mr-2 text-white animate-spin'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 
                      50 100.591C22.3858 100.591 0 78.2051 0 50.5908
                      C0 22.9766 22.3858 0.59082 50 0.59082
                      C77.6142 0.59082 100 22.9766 100 50.5908
                      Z'
                    fill='#E5E7EB'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 
                      97.0079 33.5539C95.2932 28.8227 92.871 24.3692 
                      89.8167 20.348C85.8452 15.1192 80.8826 10.7238 
                      75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 
                      56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 
                      41.7345 1.27873C39.2613 1.69328 37.813 4.19778 
                      38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 
                      44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 
                      55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 
                      70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 
                      82.5849 25.841C84.9175 28.9121 86.7997 32.2913 
                      88.1811 35.8758C89.083 38.2158 91.5421 39.6781 
                      93.9676 39.0409Z'
                    fill='currentColor'
                  />
                </svg>
                Đang xử lý...
              </div>
            ) : (
              'Thiết lập'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewOrderDay
