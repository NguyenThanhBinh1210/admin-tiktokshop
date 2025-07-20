/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createProducts } from '~/apis/productSpecial'
import { toast } from 'react-toastify'
import { DatePicker, DatePickerProps } from 'antd'
// import dayjs from 'dayjs' // Nếu bạn cần format ngày

const CreateSetProduct = ({ isOpen, onClose, data }: any) => {
  const queryClient = useQueryClient()

  // Đổi tên các state cho đúng với controller/schema mới
  const [username, setUsername] = useState('')
  const [productId, setProductId] = useState('')
  const [refillOrder, setRefillOrder] = useState('')
  const [quantity, setQuantity] = useState('1')

  // Lấy ngày hiện tại (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0]
  const [day, setDay] = useState<string>(today)

  // Tham chiếu Modal (để đóng khi click bên ngoài)
  const modalRef = useRef<HTMLDivElement>(null)
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  // Xử lý khi click nút Submit
  const mutation = useMutation((body: any) => {
    // body sẽ được gửi đến API qua hàm createProducts
    return createProducts(body)
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Tạo body data đúng với backend đang mong đợi
    const body = {
      username,
      productId,
      // parseInt hoặc Number để chắc chắn là kiểu số
      refillOrder: Number(refillOrder),
      quantity: Number(quantity),
      day
    }

    // Gửi dữ liệu qua mutation
    mutation.mutate(body, {
      onSuccess: (datas: any) => {
        // Invalidate query để reload data
        queryClient.invalidateQueries({ queryKey: ['products', data] })
        toast.success(datas?.data?.message || 'Thêm thành công')
        onClose()
      },
      onError: (error: any) => {
        toast.warn(error?.response?.data?.message || 'Lỗi thêm sản phẩm')
      }
    })
  }

  // Xử lý khi user chọn ngày trên DatePicker
  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDay(dateString) // Lưu dateString vào state day
  }

  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={handleModalClick}
      className={`${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } fixed bg-[#02020246] dark:bg-[#ffffff46] top-0 left-0 right-0 z-50 w-[100vw] p-4 overflow-x-hidden overflow-y-auto h-[100vh] transition-all`}
    >
      <div
        ref={modalRef}
        className='relative z-100 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-2xl tablet:max-w-xl max-h-full'
      >
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <button
            onClick={onClose}
            type='button'
            className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
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

          <div className='px-6 py-6 lg:px-8'>
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
              Tạo đơn cần săn cho tài khoản
            </h3>

            <form className='space-y-6' onSubmit={handleSubmit}>
              {/* Ngày (day) */}
              <div className='mb-3' onClick={(e) => e.stopPropagation()}>
                <label className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                  Chọn ngày (mặc định hôm nay)
                </label>
                <DatePicker
                  // Nếu muốn hiện giá trị của day:
                  // value={day ? dayjs(day, 'YYYY-MM-DD') : null}
                  onChange={onDateChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                />
              </div>

              {/* productId */}
              <div>
                <label
                  htmlFor='productId'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Mã sản phẩm
                </label>
                <input
                  required
                  type='text'
                  id='productId'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                             dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Mã sản phẩm'
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
                <p className='mt-4 text-sm text-red-600'>
                  <span>Lưu ý</span>: Vui lòng nhập mã sản phẩm có giá tiền nhỏ hơn tiền trong ví.
                </p>
              </div>

              {/* username, refillOrder, quantity */}
              <div className='grid grid-cols-3 gap-x-4'>
                {/* username */}
                <div>
                  <label
                    htmlFor='username'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Username
                  </label>
                  <input
                    required
                    type='text'
                    id='username'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                               dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* refillOrder (số thứ tự đơn) */}
                <div>
                  <label
                    htmlFor='refillOrder'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Thứ tự đơn
                  </label>
                  <input
                    required
                    type='number'
                    min='1'
                    id='refillOrder'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                               dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='VD: 1'
                    value={refillOrder}
                    onChange={(e) => setRefillOrder(e.target.value)}
                  />
                </div>

                {/* quantity (số lượng sản phẩm) */}
                <div>
                  <label
                    htmlFor='quantity'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Số lượng
                  </label>
                  <input
                    required
                    type='number'
                    min='1'
                    id='quantity'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                               dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='1'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <button
                type='submit'
                className='w-full text-white bg-blue-700 hover:bg-blue-800
                           focus:ring-4 focus:outline-none focus:ring-blue-300
                           font-medium rounded-lg text-sm px-5 py-2.5 text-center
                           dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                {mutation.isLoading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      aria-hidden='true'
                      role='status'
                      className='inline w-4 h-4 mr-3 text-white animate-spin'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858
                           100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
                           0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144
                           50.5908C9.08144 73.1895 27.4013 91.5094 50
                           91.5094C72.5987 91.5094 90.9186
                           73.1895 90.9186 50.5908C90.9186 27.9921
                           72.5987 9.67226 50 9.67226C27.4013
                           9.67226 9.08144 27.9921 9.08144
                           50.5908Z'
                        fill='#E5E7EB'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038
                           97.8624 35.9116 97.0079 33.5539C95.2932
                           28.8227 92.871 24.3692 89.8167 20.348C85.8452
                           15.1192 80.8826 10.7238 75.2124 7.41289C69.5422
                           4.10194 63.2754 1.94025 56.7698
                           1.05124C51.7666 0.367541 46.6976
                           0.446843 41.7345 1.27873C39.2613
                           1.69328 37.813 4.19778 38.4501
                           6.62326C39.0873 9.04874 41.5694
                           10.4717 44.0505 10.1071C47.8511
                           9.54855 51.7191 9.52689 55.5402
                           10.0491C60.8642 10.7766 65.9928
                           12.5457 70.6331 15.2552C75.2735
                           17.9648 79.3347 21.5619 82.5849
                           25.841C84.9175 28.9121 86.7997
                           32.2913 88.1811 35.8758C89.083
                           38.2158 91.5421 39.6781 93.9676
                           39.0409Z'
                        fill='currentColor'
                      />
                    </svg>
                    Đang chờ...
                  </div>
                ) : (
                  'Thêm'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateSetProduct
