import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import ButtonLoading from '../Loading/ButtonLoading'
import { UpdateWalletHistory } from '~/apis/payment.api'
import { toast } from 'react-toastify'

const ConfirmModal = ({ isOpen, onClose, data }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const initialFromState = {
    nfo: ''
  }
  const [formState, setFormState] = useState(initialFromState)

  const queryClient = useQueryClient()
  const updateMutations = useMutation({
    mutationFn: ({ id, status,  }: { id: string; status: string; }) =>
      UpdateWalletHistory(id, status, ),
    onSuccess: () => {
      onClose()
      toast.success('Xác nhận thành công!')
      queryClient.invalidateQueries('update-all-historys')
    }
  })
  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    formState.nfo === '' && toast.warn('Chưa điền lý do!')
    formState.nfo !== '' && updateMutations.mutate({ id: data._id,  status: 'done' })
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
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Lý do xác nhận</h3>
            <form className='space-y-6' action='#' autoComplete='false' onSubmit={(e) => handleSubmit(e)}>
              <div>
                <textarea
                  name='nfo'
                  id='nfo'
                  disabled={data?.nfo !== ''}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder=''
                  value={formState?.nfo || data?.nfo || ''}
                  onChange={handleChange('nfo')}
                />
              </div>
              {data?.nfo === '' && (
                <button
                  type='submit'
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  {updateMutations.isLoading ? <ButtonLoading /> : 'Xác nhận'}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
