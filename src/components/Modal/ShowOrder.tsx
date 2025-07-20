/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { FormatNumber } from '~/hooks/useFormatNumber'
const ShowOrder = ({ isOpen, onClose, data }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }
  const initialFromState = {
    Sum: 0,
    complete: '',
    email: '',
    address: '',
    isPayment: false,
    mota: '',
    name: '',
    note: '',
    phone: '',
    quan: '',
    quantity: 0,
    soDon: 0,
    status: false,
    tinh: '',
    xa: '',
    product: []
  }
  useEffect(() => {
    setFormState(data)
  }, [data])
  const [isModalProductOpen, setModalProductOpen] = useState(false)
  const showProduct = () => {
    setModalProductOpen(true)
  }
  const [formState, setFormState] = useState(initialFromState)

  const handleCloseModal = () => {
    setModalProductOpen(false)
  }

  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={handleModalClick}
      className={` ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } fixed bg-[#02020246] dark:bg-[#ffffff46] top-0 left-0 right-0 z-50 w-[100vw] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] transition-all`}
    >
      <div
        ref={modalRef}
        className='relative z-100  left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] max-w-2xl tablet:max-w-xl max-h-full'
      >
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <button
            onClick={isModalProductOpen ? handleCloseModal : onClose}
            type='button'
            className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
            data-modal-hide='authentication-modal'
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
            <h3 className='mb-4 text-xl font-bold text-gray-900 dark:text-white '>
              {isModalProductOpen ? 'Danh sách các mặt hàng' : 'Xác nhận đơn hàng'}
            </h3>
            {isModalProductOpen ? (
              <div className='px-6 py-6 lg:px-8 mobile:px-0'>
                <div className='space-y-6'>
                  {data?.products.map((item: any) => (
                    <div key={item._id} className='flex gap-x-5'>
                      <div className='relative mb-4 group w-[100px] h-[100px] overflow-hidden rounded-full'>
                        <img src={item.image[0]} alt='avatar' />
                      </div>
                      <div className='flex flex-col justify-between pb-6'>
                        <div>{item.title}</div>
                        <div>
                          Số lượng đặt: <strong>{item.quantity}</strong>
                        </div>
                        <div>
                          Tổng giá: <strong>{FormatNumber(item.price)}đ</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-y-4 gap-x-4'>
                  <div>
                    <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Tên
                    </label>
                    <input
                      disabled
                      type='text'
                      name='name'
                      id='name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Tên'
                      value={formState?.name !== '' ? formState?.name : data?.name}
                    />
                  </div>
                  <div>
                    <label htmlFor='phone' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Số điện thoại
                    </label>
                    <input
                      disabled
                      type='text'
                      name='phone'
                      id='phone'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Tên'
                      value={formState?.phone !== '' ? formState?.phone : data?.phone}
                    />
                  </div>
                  <div className='mobile:col-span-2'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Email
                    </label>
                    <input
                      disabled
                      type='text'
                      name='email'
                      id='email'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Giá'
                      value={formState?.email !== '' ? formState?.email : data?.email}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='address' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Địa chỉ
                  </label>
                  <textarea
                    disabled
                    name='address'
                    id='address'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Địa chỉ'
                    value={formState?.address !== '' ? formState?.address : data?.address}
                  />
                </div>
                <div>
                  <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Mô tả
                  </label>
                  <textarea
                    disabled
                    name='description'
                    id='description'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Mô tả'
                    value={formState?.mota !== '' ? formState?.mota : data?.mota}
                  />
                </div>

                <div>
                  <label htmlFor='note' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Ghi chú
                  </label>
                  <textarea
                    name='note'
                    id='note'
                    disabled
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Số lượng'
                    value={formState?.note !== '' ? formState?.note : data?.note}
                  />
                </div>
                <div className='mx-auto w-max text-gray-700 font-bold text-2xl'>Tổng: {FormatNumber(data?.Sum)}đ</div>
                <button
                  type='submit'
                  onClick={showProduct}
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Xem danh sách đặt hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowOrder
