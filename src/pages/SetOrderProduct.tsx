/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteProducts, getAllProducts, searchProducts } from '~/apis/productSpecial'
import Loading from '~/components/Loading/Loading'
import CreateSetProduct from '~/components/Modal/CreateSetProduct'
import ShowProduct from '~/components/Modal/ShowProduct'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import { FormatNumber, FormatNumberK } from '~/hooks/useFormatNumber'
import usePagination from '~/hooks/usePagination'

const SetOrderProduct = () => {
  const [staff, setStaff] = useState<any>([])
  const [search, setSearch] = useState<string>('')
  const [searchGia, setSearchGia] = useState<string>('')
  // const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, staff)
  const [showComment, setShowComment] = useState()
  const [searchType, setSearchType] = useState<string>('id')
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpenCreate, setModalOpenCreate] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const limit = 8 // Số sản phẩm trên mỗi trang

  const queryClient = useQueryClient()
  const searchMutation = useMutation({
    mutationFn: ({ username }: { username?: string }) => searchProducts(username)
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, status, customer }: { id: string; status: string; customer: string }) =>
      deleteProducts(id, status, customer)
  })
  const handleDeleteStaff = (id: string, status: string, customer: string) => {
    deleteMutation.mutate(
      { id, status, customer },
      {
        onSuccess: () => {
          toast.success('Đã xoá!')
          queryClient.invalidateQueries({ queryKey: ['products', currentPage] })
        },
        onError: () => {
          toast.warn('Lỗi!')
        }
      }
    )
  }

  // Fetch all products with pagination
  const { data, isLoading: isLoadingUser } = useQuery(
    ['products', currentPage],
    () => getAllProducts({ page: currentPage, limit }),
    {
      onSuccess: (data: any) => {
        setStaff(data.data.products)
        setTotalPages(data.data.totalPages)
      },
      onError: () => {
        toast.warn('Lỗi khi tải sản phẩm!')
      },
      keepPreviousData: true // Giữ dữ liệu cũ khi đang tải trang mới
    }
  )

  // const handleDeleteStaff = (id: string, status: string, customer: string) => {
  //   deleteMutation.mutate({ id, status, customer })
  // }

  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page)
  //   }
  // }

  // const { isLoading: isLoadingUser } = useQuery({
  //   queryKey: ['product', 11],
  //   queryFn: () => {
  //     return getAllProducts()
  //   },
  //   onSuccess: (data) => {
  //     console.log('data', data)
  //     setStaff(data.data.Products)
  //   },
  //   cacheTime: 30000
  // })
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const handleSearch = (e: any) => {
    e.preventDefault()
    searchMutation.mutate(
      { username: search }, // Tìm kiếm theo title
      {
        onSuccess: (data) => {
          setStaff(data.data)
          setCurrentPage(1)
        },
        onError: (error: any) => {
          toast.warn(error.message)
        }
      }
    )
  }

  return (
    <>
      <SearchHeader
        count={staff.length}
        search={search}
        setSearch={setSearch}
        // setSearchType={setSearchType}
        // setSearchGia={setSearchGia}
        // searchType={searchType}
        handleSearch={(e: any) => handleSearch(e)}
        hanldeOpenModal={() => setModalOpenCreate(true)}
        placeholder={'Vui lòng nhập username'}
        title={'sản phẩm'}
      />

      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingUser ? (
          <Loading />
        ) : (
          <>
            <div className='relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      STT
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Tài khoản
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Đơn thứ
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Số lượng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Mã sản phẩm
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Ảnh
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Tên
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Đơn giá
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Lợi nhuận
                    </th>

                    <th scope='col' className='px-6 py-3'>
                      Ngày thiết lập
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((item: any, idx: number) => (
                    <tr
                      key={item._id}
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    >
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {'#' + (idx + 1 + (currentPage - 1) * limit)}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item.userId?.username ? item.userId.username : 'Tài khoản đã bị xoá'}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item.refillOrder}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item.quantity}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.productId?._id}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.productId?.image[0] ? (
                          <img
                            className='round-full'
                            src={item.productId?.image}
                            alt='avatar'
                            style={{ width: '25px', height: '25px' }}
                          />
                        ) : (
                          'No Image'
                        )}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.productId?.title.split(' ').slice(0, 10).join(' ')}
                        {item?.productId?.title.split(' ').length > 8 && '...'}
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.productId?.price}$
                      </th>

                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.productId?.ratio}%
                      </th>
                      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item?.day}
                      </th>
                      <th
                        scope='row'
                        className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        <button
                          onClick={() =>
                            handleDeleteStaff(
                              item._id,
                              `đã xoá sản phẩm ${item?.productId?.title}`,
                              ''
                            )
                          }
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                        >
                          Xoá
                        </button>

                      </th>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>

      <ShowProduct data={showComment} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <CreateSetProduct data={currentPage} isOpen={isModalOpenCreate} onClose={() => setModalOpenCreate(false)} />
    </>
  )
}
export default SetOrderProduct
