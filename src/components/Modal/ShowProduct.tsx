/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getAllCategory, updateProduct } from '~/apis/product.api'
import { toast } from 'react-toastify'
import { getAllBrand } from '~/apis/brand.api'
const ShowProduct = ({ isOpen, onClose, data }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }
  const initialFromState = {
    title: '',
    image: [],
    category: {
      _id: '',
      nameCategory: ''
    },
    note: '',
    price: 0,
    priceOld: 0,
    quantity: 0,
    size: '',
    brand: {
      _id: '',
      nameBrand: ''
    },
    use: '',
    wording: '',
    description: ''
  }
  const queryClient = useQueryClient()
  const mutation = useMutation((body: any) => {
    return updateProduct(data._id, body)
  })
  const mutationChangeAvatar = useMutation((image) => {
    return updateProduct(data._id, { image })
  })
  const [formState, setFormState] = useState(initialFromState)
  useEffect(() => {
    setFormState(data)
  }, [data])
  const [category, setCategory] = useState([])
  const [brand, setBrand] = useState([])
  useQuery({
    queryKey: ['category', 10],
    queryFn: () => {
      return getAllCategory({
        page: 1
      })
    },
    onSuccess: (data) => {
      setCategory(data.data)
    },
    cacheTime: 30000
  })
  useQuery({
    queryKey: ['brand', 48],
    queryFn: () => {
      return getAllBrand({
        page: 1
      })
    },
    onSuccess: (data) => {
      setBrand(data.data)
    },
    cacheTime: 30000
  })
  const handleChange =
    (name: string) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    }

  const handleAvatar = (e: any) => {
    const formData: any = new FormData()
    const file = e.target.files[0]
    if (file) {
      formData.append('avatar', file)
      mutationChangeAvatar.mutate(file, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['user', 3] })
          toast.success('Đổi avatar thành công!')
          onClose()
        },
        onError: () => {
          toast.error('Lỗi khi cập nhật avatar!')
        }
      })
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(formState);
    mutation.mutate(formState, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product', 11] })
        setFormState(initialFromState)
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
            <div className='relative mb-4 group w-[200px] h-[200px] mx-auto overflow-hidden rounded-full'>
              <img src={data?.image[0]} alt='avatar' />
            </div>
            <form className='space-y-6' action='#' autoComplete='false' onSubmit={(e) => handleSubmit(e)}>
              <div className='flex items-center justify-center w-full'>
                <label
                  htmlFor='dropzone-file'
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
                    id='dropzone-file'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      handleAvatar(e)
                    }}
                  />
                </label>
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
                  placeholder='Tên'
                  value={formState?.title !== '' ? formState?.title : data?.title}
                  onChange={handleChange('title')}
                />
              </div>
              <div className='grid grid-cols-3 gap-x-4'>
                <div>
                  <label htmlFor='category' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Danh mục
                  </label>
                  <select
                    id='category'
                    onChange={handleChange('category')}
                    value={formState?.category._id !== '' ? formState?.category._id : data?.category._id}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  >
                    {category.map((item: any) => (
                      <option key={item._id} selected value={item._id}>
                        {item.nameCategory}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Giá
                  </label>
                  <input
                    type='text'
                    name='price'
                    id='price'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Giá'
                    value={formState?.price !== 0 ? formState?.price : data?.price}
                    onChange={handleChange('price')}
                  />
                </div>
                <div>
                  <label htmlFor='priceOld' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Giá gốc
                  </label>
                  <input
                    type='text'
                    name='priceOld'
                    id='priceOld'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Giá gốc'
                    value={formState?.priceOld !== 0 ? formState?.priceOld : data?.priceOld}
                    onChange={handleChange('priceOld')}
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 gap-x-4'>
                <div>
                  <label htmlFor='brand' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Danh mục
                  </label>
                  <select
                    id='brand'
                    onChange={handleChange('brand')}
                    value={formState?.brand._id !== '' ? formState?.brand._id : data?.brand._id}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  >
                    {brand.map((item: any) => (
                      <option key={item._id} selected value={item._id}>
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
                    type='text'
                    name='size'
                    id='size'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Giá'
                    value={formState?.size !== '' ? formState?.size : data?.size}
                    onChange={handleChange('size')}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-x-4'>
                <div>
                  <label htmlFor='wording' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Wording
                  </label>
                  <input
                    type='text'
                    name='wording'
                    id='wording'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Wording'
                    value={formState?.wording !== '' ? formState?.wording : data?.wording}
                    onChange={handleChange('wording')}
                  />
                </div>
                <div>
                  <label htmlFor='note' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Note
                  </label>
                  <input
                    type='text'
                    name='note'
                    id='note'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Note'
                    value={formState?.note !== '' ? formState?.note : data?.note}
                    onChange={handleChange('note')}
                  />
                </div>
              </div>
              <div>
                <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Mô tả
                </label>
                <textarea
                  name='description'
                  id='description'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  placeholder='Số lượng'
                  value={formState?.description !== '' ? formState?.description : data?.description}
                  onChange={handleChange('description')}
                />
              </div>
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
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowProduct
