import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteContact, getAllContact, searchContact } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateModal from '~/components/Modal/CreateModal'
import ShowMessage from '~/components/Modal/ShowMessage'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import usePagination from '~/hooks/usePagination'

const Contact = () => {
  const queryClient = useQueryClient()
  const [data, setData] = useState<any>([])
  const [showComment, setShowComment] = useState()
  const [isModalOpen, setModalOpen] = useState(false)
  const { data: dataConfig, isLoading: isLoadingOption } = useQuery({
    queryKey: ['contacts', 1],
    queryFn: () => {
      return getAllContact({
        page: 1
      })
    },
    onSuccess: (data) => {
      setData(data.data.comments)
    },
    cacheTime: 60000
  })
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, data)

  const searchMutation = useMutation({
    mutationFn: (title: string) => searchContact(title)
  })
  const deleteMutation = useMutation({
    mutationFn: (body: any) => deleteContact(body),
    onError: () => {
      toast.warn('Error')
    },
    onSuccess: () => {
      toast.success('Đã xoá')
      queryClient.invalidateQueries({ queryKey: ['contacts', 1] })
    }
  })
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const handleDelete = (id: string) => {
    const body = [id]
    deleteMutation.mutate(body)
  }
  const [search, setSearch] = useState<string>('')

  const handleSearch = (e: any) => {
    e.preventDefault()
    searchMutation.mutate(search, {
      onSuccess: (data) => {
        setData(data.data)
        setCurrentPage(1)
      },
      onError: (error: unknown) => {
        console.log(error)
      }
    })
  }
  return (
    <>
      <SearchHeader
        count={data.length}
        search={search}
        setSearch={setSearch}
        handleSearch={(e: any) => handleSearch(e)}
        title={'liên hệ'}
      />
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
                      Email
                    </th>
                    {/* <th scope='col' className='px-6 py-3'>
                      Địa chỉ
                    </th> */}
                    <th scope='col' className='px-6 py-3'>
                      Nội dung
                    </th>
                    {/* <th scope='col' className='px-6 py-3'>
                      Số điện thoại
                    </th> */}
                    <th scope='col' className='px-6 py-3'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                {currentData.length !== 0 && (
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
                            {item?.email}
                          </th>
                          {/* <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.address}
                          </th> */}
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <div className='max-w-[180px] whitespace-normal line-clamp-1'>{item?.content}</div>
                          </th>
                          {/* <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white mobile:w-[200px]'
                          >
                            {item?.phone}
                          </th> */}
                          <th
                            scope='row'
                            className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <button
                              type='button'
                              onClick={() => {
                                setShowComment(item)
                                setModalOpen(true)
                              }}
                              className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'
                            >
                              Xem
                            </button>
                            <button
                              type='button'
                              onClick={() => handleDelete(item._id)}
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
      <ShowMessage data={showComment} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export default Contact
