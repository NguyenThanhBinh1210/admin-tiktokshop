/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getAllIp } from '~/apis/product.api'
import { deleteIp } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateNotify from '~/components/Modal/CreateNotify'
// import ShowMessage from '~/components/Modal/ShowMessage.1'
import Paginate from '~/components/Pagination/Paginate'
import SoLuong from '~/components/Search/SoLuong'
import usePagination from '~/hooks/usePagination'
import { formatTime } from '~/utils/utils'

const Ip = () => {
  const queryClient = useQueryClient()
  const [data, setData] = useState<any>([])
  const [showComment, setShowComment] = useState()
  const [isModalOpen, setModalOpen] = useState(false)
  const { isLoading: isLoadingOption } = useQuery({
    queryKey: ['noti', 5],
    queryFn: () => {
      return getAllIp()
    },
    onSuccess: (data) => {
      console.log(data)
      setData(data.data)
    },
    cacheTime: 60000
  })
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, data)
  const deleteMutation = useMutation({
    mutationFn: ({ id, status, customer }: { id: string; status: string; customer: string }) => deleteIp( id, status, customer),
    onError: () => {
      toast.warn('Error')
    },
    onSuccess: () => {
      toast.success('Đã xoá')
      queryClient.invalidateQueries({ queryKey: ['noti', 5] })
    }
  })
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const handleDelete = (id: string, status: string, customer: string) => {
    deleteMutation.mutate({ id, status, customer })
  }
  const [search, setSearch] = useState<string>('')

  const handleSearch = (e: any) => {
    e.preventDefault()
  }
  const [isModalOpenCreate, setModalOpenCreate] = useState(false)

  return (
    <>
      <SoLuong notShowSearch count={data.length} />
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingOption ? (
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
                      Ip
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      UserName
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      PhoneNumber
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      THời gian
                    </th>

                    <th scope='col' className='px-6 py-3'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                {currentData?.length !== 0 && (
                  <tbody>
                    {currentData?.map((item: any, idx: number) => {
                      return (
                        <tr
                          key={item._id}
                          className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        >
                          <th
                            scope='row'
                            className='w-[100px] px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {'#' + (idx + 1)}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.ip}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.userId == null ? 'Tk đã bị xoá' : item?.userId?.username}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.userId == null ? 'Tk đã bị xoá' : item?.userId?.name}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.userId == null ? 'Tk đã bị xoá' : item?.userId?.phone}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {formatTime(item?.createdAt)}
                          </th>

                          <th
                            scope='row'
                            className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <button
                              type='button'
                              onClick={() =>
                                handleDelete(
                                  item._id,
                                  `xoá lịch sử ip của ${item?.userId?.username}`,
                                  item?.userId?.username
                                )
                              }
                              className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                            >
                              Xoá
                            </button>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
      <CreateNotify isOpen={isModalOpenCreate} onClose={() => setModalOpenCreate(false)} />
    </>
  )
}

export default Ip
