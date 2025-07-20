/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { deleteBrand, getAllBrand, searchBrand } from '~/apis/brand.api'
import { deleteCategory, getAllCategory, searchCategory } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateBrand from '~/components/Modal/CreateBrand'
import CreateCategory from '~/components/Modal/CreateCategory'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import CommonTable from '~/components/Table/Table'
import usePagination from '~/hooks/usePagination'

const Brand = () => {
  const [staff, setStaff] = useState<any>([])
  const [search, setSearch] = useState<string>('')
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, staff)
  console.log(staff)
  const [showBrand, setShowBrand] = useState<any | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpenCreate, setModalOpenCreate] = useState(false)

  const searchMutation = useMutation({
    mutationFn: (title: string) => searchBrand(title)
  })
  const deleteMutation = useMutation({
    mutationFn: (body: any) => deleteBrand(body)
  })
  const queryClient = useQueryClient()
  const handleDeleteBrand = (id: string) => {
    const body = [id]
    deleteMutation.mutate(body, {
      onSuccess: () => {
        toast.success('Đã xoá!')
        queryClient.invalidateQueries({ queryKey: ['brand', 48] })
      },
      onError: () => {
        toast.warn('Lỗi!')
      }
    })
  }
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['brand', 48],
    queryFn: () => {
      return getAllBrand({
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
        title={'thương hiệu'}
      />
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingUser ? (
          <Loading />
        ) : (
          <>
            <CommonTable
              data={staff}
              columns={['stt', 'nameBrand']}
              handleDelete={handleDeleteBrand}
              showModal={setModalOpen}
              showData={setShowBrand}
            />
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
      <CreateBrand
        data={showBrand}
        isOpen={isModalOpenCreate || isModalOpen}
        onClose={() => {
          setModalOpenCreate(false)
          setModalOpen(false)
          setShowBrand(null)
        }}
      />
    </>
  )
}

export default Brand
