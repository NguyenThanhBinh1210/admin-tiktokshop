/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteCategory, getAllCategory, searchCategory } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateCategory from '~/components/Modal/CreateCategory'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import CommonTable from '~/components/Table/Table'
import usePagination from '~/hooks/usePagination'

const Categories = () => {
  const [staff, setStaff] = useState<any>([])
  console.log(staff)
  const [search, setSearch] = useState<string>('')
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, staff)

  const [showComment, setShowComment] = useState<any | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpenCreate, setModalOpenCreate] = useState(false)

  const searchMutation = useMutation({
    mutationFn: (title: string) => searchCategory(title)
  })
  const deleteMutation = useMutation({
    mutationFn: (body: any) => deleteCategory(body)
  })
  const queryClient = useQueryClient()
  const handleDeleteStaff = (id: string) => {
    const body = [id]
    deleteMutation.mutate(body, {
      onSuccess: () => {
        toast.success('Đã xoá!')
        queryClient.invalidateQueries({ queryKey: ['category', 10] })
      },
      onError: () => {
        toast.warn('Lỗi!')
      }
    })
  }
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['category', 10],
    queryFn: () => {
      return getAllCategory({
        page: 1
      })
    },
    onSuccess: (data) => {
      setStaff(data.data)
    },
    cacheTime: 30000
  })
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const handleSearch = (e: any) => {
    e.preventDefault()
    searchMutation.mutate(search, {
      onSuccess: (data) => {
        setStaff(data.data)
        setCurrentPage(1)
      },
      onError: () => {
        toast.warn('Lỗi!')
      }
    })
  }
  return (
    <>
      <SearchHeader
        count={staff.length}
        search={search}
        setSearch={setSearch}
        handleSearch={(e: any) => handleSearch(e)}
        hanldeOpenModal={() => setModalOpenCreate(true)}
        title={'danh mục'}
      />
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingUser ? (
          <Loading />
        ) : (
          <>
            <CommonTable
              data={staff}
              columns={['stt', 'nameCategory']}
              handleDelete={handleDeleteStaff}
              showModal={setModalOpen}
              showData={setShowComment}
            />
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
      <CreateCategory
        data={showComment}
        isOpen={isModalOpenCreate || isModalOpen}
        onClose={() => {
          setModalOpenCreate(false)
          setModalOpen(false)
          setShowComment(null)
        }}
      />
    </>
  )
}

export default Categories
