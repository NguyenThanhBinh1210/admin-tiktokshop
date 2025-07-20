/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteComment, getAllComment, searchComment } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateModal from '~/components/Modal/CreateModal'
import RepModal from '~/components/Modal/RepModal'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import usePagination from '~/hooks/usePagination'
const Comment = () => {
  const [data, setData] = useState<any>([])
  console.log(data)
  const [showComment, setShowComment] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const [showComments, setShowComments] = useState(null)
  const [isModalOpens, setModalOpens] = useState(false)

  const { data: dataConfig, isLoading: isLoadingOption } = useQuery({
    queryKey: ['comments', 2],
    queryFn: () => {
      return getAllComment({
        page: 1
      })
    },
    onSuccess: (data) => {
      setData(data.data.comments)
    },
    cacheTime: 120000
  })
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, data)

  const searchMutation = useMutation({
    mutationFn: (title: string) => searchComment(title)
  })
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (body: any) => deleteComment(body),
    onError: () => {
      toast.warn('Error')
    },
    onSuccess: () => {
      toast.success('Đã xoá')
      queryClient.invalidateQueries({ queryKey: ['comments', 2] })
    }
  })
  const handleDelete = (id: string) => {
    const body = [id]
    deleteMutation.mutate(body)
  }
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
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
        // toast.warn(error.response.data)
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
        title={'bình luận'}
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
                      Ảnh hàng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Tên
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Email
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Tiêu đề
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Nội dung
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Đánh giá
                    </th>
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
                            <div className='w-14 h-14 overflow-hidden rounded-full'>
                              <img src={item?.product.image[0]} alt='' />
                            </div>
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.name}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.email}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            {item?.title}
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <div className='max-w-[180px] whitespace-normal line-clamp-1'>{item?.content}</div>
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white mobile:w-[200px]'
                          >
                            {item?.rating} sao
                          </th>
                          <th
                            scope='row'
                            className='px-6 py-3 w-[200px] h-full  gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                          >
                            <button
                              type='button'
                              onClick={() => {
                                setShowComment(item)
                                setModalOpen(true)
                              }}
                              className='text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'
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
      <CreateModal data={showComment} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <RepModal data={showComments} isOpen={isModalOpens} onClose={() => setModalOpens(false)} />
    </>
  )
}

export default Comment
