/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { updateStaff } from '~/apis/product.api'
import { toast } from 'react-toastify'
import { updateBank } from '~/apis/admin.api'
import { AppContext } from '~/contexts/app.context'
const Modal = ({ isOpen, onClose, data }: any) => {
  const { profile } = React.useContext(AppContext);
  const [name, setName] = useState<any>()
  const [username, setUsername] = useState<any>()
  const [bankName, setBankName] = useState<any>()
  const [banKNumber, setBankNumber] = useState<any>()
  const [percentageItems, setPercentageItems] = useState<any>()
  const [formState, setFormState] = useState<any>({})
  const initialFromState = {
    name: '',
    username: '',
    password: '',
    bankName: '',
    banKNumber: ''
  }
  const modalRef = useRef<HTMLDivElement>(null)
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
      setFormState(initialFromState)
    }
  }
  console.log(formState)
  const queryClient = useQueryClient()
  const mutation = useMutation((body: any) => {
    return updateStaff(data._id, body)
  })
  const mutationUpdateBank = useMutation((body: any) => {
    console.log('body', body)
    return updateBank(data._id, body)
  })
  console.log(data)
  useEffect(() => {
    setName(data?.nameUserBank ? data?.nameUserBank : '')
    setUsername(data?.username ? data?.username : '')
    setBankName(data?.bankName ? data?.bankName : '')
    setBankNumber(data?.banKNumber ? data?.banKNumber : '')
    setPercentageItems(data?.percentageItems ? data?.percentageItems : '')

    setFormState(data)
  }, [data])

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({ ...prev, [name]: event.target.value }))
  }

  const handleUpdateBank = (event: any) => {
    event.preventDefault()
    const newData = {
      bankNumber: banKNumber,
      bankName: bankName,
      nameUserBank: name,
      percentageItems: percentageItems,
      nameUser: data.username,
      activate: `đã update thông tin ngân hàng ${data.username}`
    }
    mutationUpdateBank.mutate(newData, {
      onSuccess: () => {
        toast.success('Đổi ngân hàng thành công!')
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        // onClose()
        // setFormState(initialFromState)
      }
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(initialFromState, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        // setFormState(initialFromState)
        toast.success('Thành công!')
        onClose()
      },
      onError: () => {
        toast.warn('Lỗi!')
      }
    })
  }
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
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Sửa ngân hàng</h3>
            <form className='space-y-6' action='#' autoComplete='false' onSubmit={handleUpdateBank}>
              <div>
                <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  id='username'
                  className='bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Username'
                  disabled
                  value={username}
                  onChange={handleChange('username')}
                />
              </div>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Chủ tài khoản
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </div>
              <div>
                <label htmlFor='bankName' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Tên ngân hàng
                </label>
                <input
                  type='text'
                  name='bankName'
                  id='bankName'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value)
                  }}
                />
              </div>
              <div>
                <label htmlFor='banKNumber' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Số tài khoản
                </label>
                <input
                  type='text'
                  name='banKNumber'
                  id='banKNumber'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={banKNumber}
                  onChange={(e) => {
                    setBankNumber(e.target.value)
                  }}
                />
              </div>
              <div>
                <label htmlFor='banKNumber' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Cấu hình % đơn hàng khách được đặt
                </label>
                <input
                  type='text'
                  name='banKNumber'
                  id='banKNumber'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={percentageItems}
                  onChange={(e) => {
                    setPercentageItems(e.target.value)
                  }}
                />
              </div>
              {profile?.isAdmin === true && ( // Check if user is admin
                <button
                  type='submit'
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  {mutation.isLoading ? (
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
                    'Sửa'
                  )}
                </button>)}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
