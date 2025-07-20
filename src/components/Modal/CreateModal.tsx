import React, { useRef } from 'react'

const CreateModal = ({ isOpen, onClose, data }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
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
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Xem bình luận</h3>
            <form className='space-y-6' action='#' autoComplete='false'>
              <div className='flex gap-x-3 items-center'>
                <div className='w-20 h-20 rounded-full overflow-hidden'>
                  <img src={data?.product.image[0]} alt='' />
                </div>

                <div
                  className='flex-1 font-semibold text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Tiêu đề'
                >
                  {data?.product.title}
                </div>
              </div>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Tên
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Tiêu đề'
                  value={data?.name}
                />
              </div>

              <div>
                <label htmlFor='title' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Email
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Tiêu đề'
                  value={data?.email}
                />
              </div>
              <div>
                <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Đánh giá
                </label>
                <div
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Không ghi địa chỉ'
                >
                  {data?.rating + ' sao'}
                </div>
              </div>
              <div>
                <label htmlFor='default-search' className=' text-sm font-medium text-gray-900  dark:text-white'>
                  Nội dung
                </label>
                <div className='mt-2'>
                  <div className='relative'>
                    <textarea
                      id='default-search'
                      disabled
                      value={data?.content}
                      className='block min-h-max w-full px-4 py-4  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='Nội dung'
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateModal
