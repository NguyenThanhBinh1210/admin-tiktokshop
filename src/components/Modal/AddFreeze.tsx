import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { addFreeze, minusFreeze } from '~/apis/admin.api'
import { updateStaff } from '~/apis/product.api'

const AddFreeze = ({ isOpen, onClose, userId }: { isOpen: boolean; onClose: () => void; userId: any }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  console.log("userId", userId);
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }
  const [value, setValue] = useState(0)
  const initialFromState = {
    userId: '',
    money: ''
  }
  const queryClient = useQueryClient()
  const mutationAdd = useMutation((body: any) => {
    return addFreeze(body)
  })
  const mutationMinus = useMutation((body: any) => {
    return minusFreeze(body)
  })
  const [formState, setFormState] = useState(initialFromState)
  const handleAdd = () => {
    const newData = {
      ...formState,
      userId: userId._id,
      money: Number(value),
      info: 'add',
      nameUser: userId.username,
      activate: `đã đóng băng ${value}$`
    }
    mutationAdd.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        setFormState(initialFromState)
        toast.success('Thành công!')
        onClose()
      },
      onError: (error: any) => {
        toast.warn(error?.response.data.message)
      }
    })
  }
  const handleMinus = () => {
    const newData = {
      ...formState,
      userId: userId._id,
      money: Number(value),
      info: 'minus',
      nameUser: userId.username,
      activate: `đã giải đóng băng ${value}$`
    }
    mutationMinus.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        setFormState(initialFromState)
        toast.success('Thành công!')
        onClose()
      },
      onError: (error: any) => {
        console.log("error");
        toast.warn(error?.response.data.message)
      }
    })
  }

  const [valueView, setValueView] = useState('0')
  const handleInputChange = (event: any) => {
    const inputValue = event.target.value
    if (inputValue === '') {
      setValue(0)
    }
    setValue(inputValue.replace(/[^0-9]/g, ''))

    let value = event.target.value
    value = value.replace(/[^0-9]/g, '')

    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    setValueView(value)
  }
  // const updateMutation = useMutation((body: any) => {
  //   // const data = {
  //   //   isLook: body.isLook,
  //   //   isDongBang: body.isDongBang
  //   // }
  //   return updateStaff(body?._id, body)
  // })
  // const handleUpdateDongBang = (item: any, activate: string) => {
  //   const newData = {
  //     _id: item._id,
  //     isDongBang: item.isDongBang ? false : true,
  //     nameUser: item.username,
  //     activate: activate
  //   }
  //   updateMutation.mutate(newData, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['user', 3] })
  //       onClose()
  //       toast.success('Thành công!')
  //     }
  //   })
  // }
  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={handleModalClick}
      className={` ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } fixed bg-[#02020246] dark:bg-[#ffffff46] top-0 left-0 right-0 z-50 w-[100vw] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] transition-all`}
    >
      <div
        ref={modalRef}
        className='relative z-100 w-full left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] max-w-md max-h-full'
      >
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <button
            onClick={onClose}
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
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Tác động đóng băng</h3>
            {/* <button
              className={` text-white ml-auto block py-1 px-2 w-10 h-full font-medium rounded-full ${
                userId.isDongBang ? 'bg-green-500' : 'bg-gray-300'
              }`}
              onClick={() =>
                handleUpdateDongBang(
                  userId,
                  `đã ${userId.isDongBang ? 'tắt' : 'bật'} đóng băng tài khoản ${userId?.username}`
                )
              }
            >
              {userId.isDongBang ? 'Bật' : 'Tắt'}
            </button> */}
            <form className='space-y-6' action='#' autoComplete='false'>
              <div>
                <label htmlFor='money' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Số tiền trong tài khoản (vnđ)
                </label>
                <input
                  disabled
                  type='text'
                  name='money'
                  id='money'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  // onChange={handleInputChange}
                  value={userId.totalAmount}
                />
              </div>
              <div>
                <label htmlFor='money' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Số tiền đã đóng băng (vnđ)
                </label>
                <input
                  disabled
                  type='text'
                  name='money'
                  id='money'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  // onChange={handleInputChange}
                  value={userId.totalFreeze}
                />
              </div>
              <div>
                <label htmlFor='money' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Số tiền (vnđ)
                </label>
                <input
                  type='text'
                  name='money'
                  id='money'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  onChange={handleInputChange}
                  value={valueView}
                />
              </div>

              <div className='grid grid-cols-2 mobile:grid-cols-1 gap-3'>
                <button
                  type='button'
                  onClick={handleAdd}
                  className='w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                >
                  {mutationAdd.isLoading ? (
                    <div>
                      <svg
                        aria-hidden='true'
                        role='status'
                        className='inline w-4 h-4 mr-3 text-white animate-spin'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                          fill='#E5E7EB'
                        />
                        <path
                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                          fill='currentColor'
                        />
                      </svg>
                      Đang chờ...
                    </div>
                  ) : (
                    'Đóng băng'
                  )}
                </button>
                <button
                  type='button'
                  onClick={handleMinus}
                  className='w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                >
                  {mutationMinus.isLoading ? (
                    <div>
                      <svg
                        aria-hidden='true'
                        role='status'
                        className='inline w-4 h-4 mr-3 text-white animate-spin'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                          fill='#E5E7EB'
                        />
                        <path
                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                          fill='currentColor'
                        />
                      </svg>
                      Đang chờ...
                    </div>
                  ) : (
                    'Trừ đóng băng'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFreeze
