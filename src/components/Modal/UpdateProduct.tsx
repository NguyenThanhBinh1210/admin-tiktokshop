/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createProduct } from '~/apis/product.api'
import { toast } from 'react-toastify'
import { objectToFormData } from '~/utils/utils'
const CreateProduct = ({ isOpen, onClose, data }: any) => {
  const [img, setImage] = useState<any>()
  const [ratio, setRatio] = useState<any>()
  const [title, setTitle] = useState<any>()
  const [price, setPrice] = useState<any>()
  const [description, setDescription] = useState<any>()

  const modalRef = useRef<HTMLDivElement>(null)
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }
  const [tempImage, setTempImage] = useState<any>()

  const queryClient = useQueryClient()
  const mutation = useMutation((body: any) => {
    console.log('body', body)
    return createProduct(body)
  })

  // const [formState, setFormState] = useState(initialFromState)
  // console.log(formState)
  // const handleChange =
  //   (name: string) =>
  //   (
  //     event:
  //       | React.ChangeEvent<HTMLInputElement>
  //       | React.ChangeEvent<HTMLTextAreaElement>
  //       | React.ChangeEvent<HTMLSelectElement>
  //   ) => {
  //     setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  //   }

  console.log(img)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // console.log(formState);
    const body = {
      title: title,
      image: img,
      ratio: ratio,
      price: price,
      description: description,
      activate: `đã tạo sản phẩm mới ${title}`,
      nameUser: ''
    }
    console.log(body)
    mutation.mutate(body, {
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ['product', 11] })
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
            <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Xem/Sửa sản phẩm</h3>
            {tempImage && (
              <div className='relative mb-4 group w-[200px] h-[200px] mx-auto overflow-hidden rounded-full'>
                <img src={tempImage} alt='avatar' />
              </div>
            )}
            <form className='space-y-6' action='#' autoComplete='false' onSubmit={(e) => handleSubmit(e)}>
              {/* <div className='flex items-center justify-center w-full'>
                <label
                  htmlFor='dropzone-file-2'
                  className='flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                >
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <svg
                      className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 16'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                      />
                    </svg>
                    <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                      <span className='font-semibold'>Click to change</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id='dropzone-file-2'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      handleAvatar(e)
                    }}
                  />
                </label>
              </div> */}
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Hình ảnh
                </label>
                {img ? (
                  <img
                    src={`${img}`}
                    alt=''
                    className='w-52 h-52 my-2 text-center items-center justify-center mx-auto'
                  />
                ) : (
                  <svg
                    className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 text-center items-center justify-center mx-auto'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                )}

                <input
                  required
                  type='linkInput'
                  name='name'
                  id='name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='nhập link hình ảnh'
                  value={img}
                  onChange={(e) => {
                    setImage(e.target.value)
                  }}
                />
              </div>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Tên
                </label>
                <input
                  required
                  type='text'
                  name='name'
                  id='name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Tên'
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                  }}
                />
              </div>
              <div className='grid grid-cols-3 gap-x-4'>
                <div>
                  <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Lơi nhuận
                  </label>
                  <input
                    required
                    type='number'
                    name='price'
                    id='price'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='%'
                    value={ratio}
                    onChange={(e) => {
                      setRatio(e.target.value)
                    }}
                  />
                </div>
                <div>
                  <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Giá
                  </label>
                  <input
                    required
                    type='text'
                    name='price'
                    id='price'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Giá'
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value)
                    }}
                  />
                </div>
                {/* <div>
                  <label htmlFor='priceOld' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Giá gốc
                  </label>
                  <input
                    required
                    type='text'
                    name='priceOld'
                    id='priceOld'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Giá gốc'
                    value={formState?.priceOld !== 0 ? formState?.priceOld : data?.priceOld}
                    onChange={handleChange('priceOld')}
                  />
                </div> */}
              </div>
              {/* <div className='grid grid-cols-3 gap-x-4'>
                <div>
                  <label htmlFor='brand' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Thương hiệu
                  </label>
                  <select
                    id='brand'
                    onChange={handleChange('brand')}
                    value={formState?.brand._id !== '' ? formState?.brand._id : data?.brand._id}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  >
                    <option hidden>Chọn Thương hiệu</option>
                    {brand.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.nameBrand}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor='quantity' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Số lượng
                  </label>
                  <input
                    required
                    type='text'
                    name='quantity'
                    id='quantity'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Số lượng'
                    value={formState?.quantity !== 0 ? formState?.quantity : data?.quantity}
                    onChange={handleChange('quantity')}
                  />
                </div>
                <div>
                  <label htmlFor='size' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Size
                  </label>
                  <input
                    required
                    type='text'
                    name='size'
                    id='size'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Size'
                    value={formState?.size !== '' ? formState?.size : data?.size}
                    onChange={handleChange('size')}
                  />
                </div>
              </div> */}
              <div>
                <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Mô tả
                </label>
                <textarea
                  required
                  name='description'
                  id='description'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Mô tả'
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                />
              </div>
              {/* <div className='grid grid-cols-2 gap-x-4'>
                <div>
                  <label htmlFor='note' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Ghi chú
                  </label>
                  <textarea
                    required
                    name='note'
                    id='note'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Ghi chú'
                    value={formState?.note !== '' ? formState?.note : data?.note}
                    onChange={handleChange('note')}
                  />
                </div>
                <div>
                  <label htmlFor='wording' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Wording
                  </label>
                  <textarea
                    required
                    name='wording'
                    id='wording'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Số lượng'
                    value={formState?.wording !== '' ? formState?.wording : data?.wording}
                    onChange={handleChange('wording')}
                  />
                </div>
              </div> */}

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

export default CreateProduct
