/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { updateRole } from '~/apis/auth.api'
// eslint-disable-next-line import/namespace
import { deleteStaff, getAllAdmin, searchUser } from '~/apis/product.api'
import Loading from '~/components/Loading/Loading'
import CreateStaff from '~/components/Modal/CreateStaff'
import GetCustomerByStaff from '~/components/Modal/GetCustomerByStaff'
import NotReSearch from '~/components/NotReSearch/NotReSearch'
import Paginate from '~/components/Pagination/Paginate'
import SearchHeader from '~/components/Search/Search'
import usePagination from '~/hooks/usePagination'

const Users = () => {
  const initialFromState = {
    name: '',
    username: '',
    password: ''
  }
  const [staff, setStaff] = useState<any>([])
  const [search, setSearch] = useState<string>('')
  const { currentPage, totalPages, currentData, setCurrentPage } = usePagination(8, staff)
  const [isModalOpenCreate, setModalOpenCreate] = useState(false)
  const [isOpenProfile, setOpenProfile] = useState<any>(null);

  const [staffModal, setStaffModal] = useState(initialFromState)
  const searchMutation = useMutation({
    mutationFn: (email: string) => searchUser(email)
  })
  const deleteMutation = useMutation({
    mutationFn: ({ id, status, customer }: { id: string; status: string; customer: string }) =>
      deleteStaff(id, status, customer)
  })
  const updateMutation = useMutation({
    mutationFn: (item: any) => updateRole(item._id, { isAdmin: item?.isAdmin ? 'false' : 'true' })
  })
  const updateMutation2 = useMutation({
    mutationFn: (item: any) => updateRole(item._id, { isStaff: item?.isStaff ? 'false' : 'true' })
  })
  const queryClient = useQueryClient()
  const handleDeleteStaff = (id: string, status: string, customer: string) => {
    deleteMutation.mutate(
      { id, status, customer },
      {
        onSuccess: () => {
          toast.success('Đã xoá!')
          queryClient.invalidateQueries({ queryKey: ['users', 3] })
        },
        onError: () => {
          toast.warn('Lỗi!')
        }
      }
    )
  }
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['users', 3],
    queryFn: () => {
      return getAllAdmin()
    },
    onSuccess: (data) => {
      console.log(data.data.user)
      setStaff(data.data.user.filter((item: any) => item.name !== 'superAdmin'))
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
        console.log(data.data)
        setStaff(data.data)
        setCurrentPage(1)
      },
      onError: () => {
        toast.warn('Lỗi!')
      }
    })
  }
  const handleUpdate = (item: any) => {
    updateMutation.mutate(item, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', 3] })
        toast.success('Thành công!')
      }
    })
  }
  const handleUpdate2 = (item: any) => {
    updateMutation2.mutate(item, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 3] })
        toast.success('Thành công!')
      }
    })
  }
  return (
    <>
      <SearchHeader
        notShowSearch
        count={staff.length}
        // search={search}
        // setSearch={setSearch}
        // handleSearch={(e: any) => handleSearch(e)}
        hanldeOpenModal={() => setModalOpenCreate(true)}
        title={'nhân viên'}
      />
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoadingUser || searchMutation.isLoading ? (
          <Loading />
        ) : (
          <>
            {!searchMutation.isLoading && currentData.length === 0 ? (
              <NotReSearch />
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
                          Tên
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          UserName
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          Cập nhập khách hàng
                        </th>


                        <th scope='col' className='px-6 py-3'>
                          Cập nhập nhân viên
                        </th>
                      </tr>
                    </thead>
                    {staff.length !== 0 && (
                      <tbody>
                        {currentData.map((item: any, idx: number) => {
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
                                {item.name}
                              </th>
                              <th
                                scope='row'
                                className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                              >
                                {item.username}
                              </th>
                              {/* <th
                                scope='row'
                                className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                              >
                                <button
                                  onClick={() => handleUpdate(item)}
                                  className='relative  inline-flex items-center cursor-pointer'
                                >
                                  <div
                                    className={`${item?.isAdmin
                                      ? "w-11 h-6 rounded-full peer dark:bg-blue-600 after:translate-x-full rtl:after:-translate-x-full after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 bg-blue-600"
                                      : "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                                      }`}
                                  />
                                </button>
                              </th>
                              <th
                                scope='row'
                                className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                              >
                                <button
                                  onClick={() => handleUpdate2(item)}
                                  className='relative inline-flex items-center cursor-pointer'
                                >
                                  <div
                                    className={`${item?.isStaff
                                      ? "w-11 h-6 rounded-full peer after:translate-x-full rtl:after:-translate-x-full  after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 bg-blue-600 dark:bg-blue-600"
                                      : "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                                      }`}
                                  />
                                </button>
                              </th> */}
                              <th
                                scope='row'
                                className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                              >
                                <button
                                  type='button'
                                  onClick={() => {
                                    setOpenProfile(item)
                                  }}
                                  className='text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'
                                >
                                  Cập nhật
                                </button>
                              </th>


                              <th
                                scope='row'
                                className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                              >
                                <button
                                  type='button'
                                  onClick={() => {
                                    setModalOpenCreate(true)
                                    setStaffModal(item)
                                  }}
                                  className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'
                                >
                                  Cập nhật
                                </button>

                                <button
                                  type='button'
                                  onClick={() =>
                                    handleDeleteStaff(item._id, `xoá tài khoản ${item?.username}`, item._id)
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
          </>
        )}
      </div>
      <CreateStaff
        data={staffModal}
        isOpen={isModalOpenCreate}
        onClose={() => {
          setModalOpenCreate(false)
          setStaffModal(initialFromState)
        }}
      />
      {isOpenProfile &&
        <GetCustomerByStaff isOpen={isOpenProfile} onClose={() => { setOpenProfile(false), queryClient.invalidateQueries(['user']) }
        } data={isOpenProfile} />}
    </>
  )
}

export default Users
