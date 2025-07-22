/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

// APIs
import { deleteStaff, getAllStaff, updateStaff } from '~/apis/product.api'

// Components
import Loading from '~/components/Loading/Loading'
import Modal from '~/components/Modal'
import CreateRecharge from '~/components/Modal/CreateRecharge'
import TruRecharge from '~/components/Modal/TruRecharge'
import NotReSearch from '~/components/NotReSearch/NotReSearch'
import Paginate from '~/components/Pagination/Paginate'
import CreateCustommer from '~/components/Modal/CreateCustommer'
import SearchHeader from '~/components/Search/Search'
import AddMoney from '~/components/Modal/AddMoney'
import MinusMoney from '~/components/Modal/MinusMoney'
import AddFreeze from '~/components/Modal/AddFreeze'
import MinusFreeze from '~/components/Modal/MinusFreeze'
import ViewProfile from '~/components/Modal/ViewProfile'
import ViewOrderDay from '~/components/Modal/ViewOrderDay'

// Context & Utils
import { AppContext } from '~/contexts/app.context'
import { formatCurrency } from '~/utils/utils'

// Types
interface StaffInitialState {
  name: string
  username: string
  password: string
  bankName: string
  banKNumber: string
  nameUserBank: string
}

interface Customer {
  _id: string
  username: string
  name: string
  idUser: string
  idRef: string
  totalAmount: number
  totalFreeze: number
  moneyComissions: number
  level: string
  isLook: boolean
  isIdRef: boolean
  isDongBang: boolean
}

// Constants
const SERVER_URL = 'https://socket.ordersdropship.com'
const ITEMS_PER_PAGE = 8

const Customer = () => {
  const { profile } = useContext(AppContext)
  const queryClient = useQueryClient()

  // Form initial state
  const initialFormState: StaffInitialState = {
    name: '',
    username: '',
    password: '',
    bankName: '',
    banKNumber: '',
    nameUserBank: '',
  }

  // State Management
  const [staff, setStaff] = useState<Customer[]>([])
  const [userId, setUserId] = useState<any>('')
  const [search, setSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [staffModal, setStaffModal] = useState(initialFormState)

  // Modal States
  const [modals, setModals] = useState({
    profile: null as any,
    orderDay: null as any,
    main: false,
    recharge: false,
    truRecharge: false,
    addMoney: false,
    minusMoney: false,
    addFreeze: false,
    minusFreeze: false,
    createCustomer: false,
  })
  
  const [showUser, setShowUser] = useState<any>(null)

  // API Queries
  const { data, isLoading: isLoadingUser, refetch } = useQuery(
    ['user', currentPage, search],
    () => getAllStaff(search, currentPage, ITEMS_PER_PAGE),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setStaff(data.data.users)
        setTotalPages(data.data.totalPages)
      },
    }
  )

  // Mutations
  const updateMutation = useMutation((body: any) => {
    const updateData = {
      isLook: body.isLook,
      isIdRef: body.isIdRef,
      isDongBang: body.isDongBang,
      level: body.level,
      nameUser: body.nameUser,
      activate: body.activate,
    }
    return updateStaff(body?._id, updateData)
  })

  const deleteMutation = useMutation((data: { id: string; status: string; customer: string }) =>
    deleteStaff(data.id, data.status, data.customer)
  )

  // Effects
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Event Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleReset = () => {
    setSearch('')
    setCurrentPage(1)
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  // Modal Handlers
  const openModal = (modalName: string, data?: any) => {
    setModals(prev => ({ ...prev, [modalName]: data || true }))
    if (data && modalName !== 'profile' && modalName !== 'orderDay') {
      setUserId(data)
    }
    if (modalName === 'main') {
      setShowUser(data)
    }
  }

  const closeModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: modalName === 'profile' || modalName === 'orderDay' ? null : false }))
    if (modalName !== 'profile' && modalName !== 'orderDay') {
      setUserId('')
    }
    if (modalName === 'main') {
      setShowUser(null)
    }
    if (modalName === 'createCustomer') {
      setStaffModal(initialFormState)
    }
    queryClient.invalidateQueries(['user', currentPage, search])
  }

  // Update Handlers
  const handleUpdateField = (item: Customer, field: 'isLook' | 'isIdRef' | 'isDongBang', activateMessage: string) => {
    const newData = {
      _id: item._id,
      [field]: !item[field],
      nameUser: item.username,
      activate: activateMessage,
    }
    
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search])
        toast.success('Thành công!')
      },
    })
  }

  const handleUpdateLevel = (item: Customer, value: string, activate: string) => {
    const newData = {
      _id: item._id,
      level: value,
      nameUser: item.username,
      activate: activate,
    }
    
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search])
        toast.success('Thành công!')
      },
    })
  }

  // Action Handlers
  const handleDeleteStaff = (id: string, status: string, customer: string) => {
    deleteMutation.mutate(
      { id, status, customer },
      {
        onSuccess: () => {
          toast.success('Đã xoá!')
          queryClient.invalidateQueries(['user', currentPage, search])
        },
        onError: () => {
          toast.warn('Lỗi!')
        },
      }
    )
  }

  const refetchData = () => {
    refetch()
    toast.info('Dữ liệu đã được làm mới!')
  }

  const logoutAll = () => {
    const socket = io(SERVER_URL)
    socket.emit('resetByAdmin')
    toast.success('Bạn đã đăng xuất tất cả user đang online!')
  }

  const logoutUser = (user: Customer) => {
    const socket = io(SERVER_URL)
    socket.emit('resetByUser', user)
    toast.success(`Bạn đã đăng xuất ${user.username}!`)
  }

  // Render Toggle Switch
  const renderToggleSwitch = (
    item: Customer,
    field: 'isLook' | 'isIdRef' | 'isDongBang',
    onText: string,
    offText: string,
    activateMessage: string
  ) => (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={item[field]}
          onChange={() => handleUpdateField(item, field, activateMessage)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer transition-colors peer-checked:bg-green-500" />
        <div className="absolute w-4 h-4 p-3 bg-white border border-gray-300 rounded-full transition-all peer-checked:translate-x-5" />
      </label>
      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {item[field] ? onText : offText}
      </span>
    </div>
  )

  // Render Action Buttons
  const renderActionButtons = (item: Customer) => (
    <div className="flex justify-center items-center gap-2">
      <button
        type="button"
        onClick={() => openModal('profile', item)}
        className="bg-green-400 hover:bg-green-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
      >
        Thông tin
      </button>
      {profile?.isAdmin && (
        <button
          type="button"
          onClick={() => handleDeleteStaff(item._id, `xoá khách hàng ${item.username}`, item.username)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
        >
          Xoá
        </button>
      )}
    </div>
  )

  return (
    <>
      <SearchHeader
        count={data?.data?.count || 0}
        search={search}
        setSearch={setSearch}
        placeholder="Tìm kiếm theo Mã giới thiệu hoặc Username..."
        handleSearch={handleSearch}
        title="khách hàng"
      />
      
      <div className="flex flex-col gap-[30px] flex-1">
        {isLoadingUser ? (
          <Loading />
        ) : (
          <>
            {staff.length === 0 ? (
              <NotReSearch handleReset={handleReset} />
            ) : (
              <>
                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={refetchData}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200"
                  >
                    Tải lại dữ liệu
                  </button>
                  <button
                    onClick={logoutAll}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200"
                  >
                    Đăng xuất tất cả
                  </button>
                </div>

                {/* Table */}
                <div className="relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="pl-6 py-3">STT</th>
                        <th scope="col" className="pl-6 py-3">ID</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">Username</th>
                        <th scope="col" className="px-6 py-3 min-w-[170px]">Người giới thiệu</th>
                        <th scope="col" className="px-6 py-3">Số tiền</th>
                        <th scope="col" className="px-6 py-3 min-w-[180px]">Số tiền đóng băng</th>
                        <th scope="col" className="px-6 py-3 min-w-[150px]">Hoa hồng</th>
                        <th scope="col" className="px-2 py-3 min-w-[100px]">Level</th>
                        <th scope="col" className="px-2 py-3 min-w-[120px]">Khoá tài khoản</th>
                        {/* <th scope="col" className="px-2 py-3 min-w-[100px]">Khoá mã mời</th> */}
                        <th scope="col" className="px-2 py-3 min-w-[140px]">Đóng băng TK</th>
                        <th scope="col" className="px-3 py-3 min-w-[130px]">Đăng xuất TK</th>
                        <th scope="col" className="px-6 py-3 text-center">Hành động</th>
                        <th scope="col" className="px-6 py-3 text-center">Order theo ngày</th>
                        <th scope="col" className="px-6 py-3 text-center min-w-[130px]">Ngân hàng</th>
                        <th scope="col" className="px-6 py-3 text-center">Nạp tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((item: Customer, idx: number) => (
                        <tr
                          key={item._id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          {/* STT */}
                          <td className="pl-6 py-3">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                          
                          {/* ID */}
                          <td className="px-3 py-3 text-xs">{item._id}</td>
                          
                          {/* Username */}
                          <td className="px-3 py-3 font-medium">{item.username}</td>
                          
                          {/* Người giới thiệu */}
                          <td className="px-6 py-3">{item.idRef}</td>
                          
                          {/* Số tiền */}
                          <td className="px-6 py-3 text-green-500 font-medium">
                            {formatCurrency(item.totalAmount)}
                          </td>
                          
                          {/* Số tiền đóng băng */}
                          <td className="px-6 py-3 text-orange-500 font-medium">
                            {formatCurrency(item.totalFreeze)}
                          </td>
                          
                          {/* Hoa hồng */}
                          <td className="px-6 py-3 text-blue-500 font-medium">
                            {formatCurrency(item.moneyComissions)}
                          </td>
                          
                          {/* Level */}
                          <td className="px-2 py-3">
                            <select
                              className="w-[100px] p-2 font-medium rounded-md bg-gray-700 text-white text-sm"
                              value={item.level}
                              onChange={(e) =>
                                handleUpdateLevel(item, e.target.value, `update level user ${item.username}`)
                              }
                            >
                              <option value="1">VIP 1</option>
                              <option value="2">VIP 2</option>
                              <option value="3">VIP 3</option>
                              <option value="4">VIP 4</option>
                              <option value="5">VIP 5</option>
                            </select>
                          </td>
                          
                          {/* Khoá tài khoản */}
                          <td className="px-3 py-3">
                            {renderToggleSwitch(
                              item,
                              'isLook',
                              'Mở',
                              'Khoá',
                              `đã ${item.isLook ? 'mở' : 'khoá'} tài khoản ${item.username}`
                            )}
                          </td>
                          
                          {/* Khoá mã mời */}
                          {/* <td className="px-3 py-3">
                            {renderToggleSwitch(
                              item,
                              'isIdRef',
                              'Mở',
                              'Khoá',
                              `đã ${item.isIdRef ? 'mở' : 'khoá'} mã mời tài khoản ${item.username}`
                            )}
                          </td> */}
                          
                          {/* Đóng băng tài khoản */}
                          <td className="px-3 py-3">
                            {renderToggleSwitch(
                              item,
                              'isDongBang',
                              'Mở',
                              'Đóng băng',
                              `đã ${item.isDongBang ? 'mở đóng băng' : 'đóng băng'} tài khoản ${item.username}`
                            )}
                          </td>
                          
                          {/* Đăng xuất tài khoản */}
                          <td className="px-3 py-3">
                            <button
                              className="w-32 h-10 font-medium text-white rounded-md transition-all duration-300 bg-red-500 hover:bg-red-600"
                              onClick={() => logoutUser(item)}
                            >
                              Đăng xuất
                            </button>
                          </td>
                          
                          {/* Hành động */}
                          <td className="px-6 py-3 text-center">
                            {renderActionButtons(item)}
                          </td>
                          
                          {/* Order theo ngày */}
                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => openModal('orderDay', item)}
                              className="bg-purple-400 hover:bg-purple-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                            >
                              Thiết lập
                            </button>
                          </td>
                          
                          {/* Ngân hàng */}
                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => openModal('main', item)}
                              className="bg-blue-400 hover:bg-blue-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                            >
                              Tác động
                            </button>
                          </td>
                          
                          {/* Nạp tiền */}
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openModal('addMoney', item)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                              >
                                Nạp
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal('minusMoney', item)}
                                className="bg-pink-400 hover:bg-pink-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                              >
                                Trừ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <Paginate 
                  totalPages={totalPages} 
                  currentPage={currentPage} 
                  handlePageChange={handlePageChange} 
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {modals.recharge && (
        <CreateRecharge
          userId={userId}
          isOpen={modals.recharge}
          onClose={() => closeModal('recharge')}
        />
      )}

      {modals.truRecharge && (
        <TruRecharge
          userId={userId}
          isOpen={modals.truRecharge}
          onClose={() => closeModal('truRecharge')}
        />
      )}

      {modals.addMoney && (
        <AddMoney
          userId={userId}
          isOpen={modals.addMoney}
          onClose={() => closeModal('addMoney')}
        />
      )}

      {modals.minusMoney && (
        <MinusMoney
          userId={userId}
          isOpen={modals.minusMoney}
          onClose={() => closeModal('minusMoney')}
        />
      )}

      {modals.addFreeze && (
        <AddFreeze
          userId={userId}
          isOpen={modals.addFreeze}
          onClose={() => closeModal('addFreeze')}
        />
      )}

      {modals.minusFreeze && (
        <MinusFreeze
          userId={userId}
          isOpen={modals.minusFreeze}
          onClose={() => closeModal('minusFreeze')}
        />
      )}

      {modals.profile && (
        <ViewProfile
          data={modals.profile}
          isOpen={!!modals.profile}
          onClose={() => closeModal('profile')}
        />
      )}

      {modals.orderDay && (
        <ViewOrderDay
          data={modals.orderDay}
          isOpen={!!modals.orderDay}
          onClose={() => closeModal('orderDay')}
        />
      )}

      {modals.main && (
        <Modal
          data={showUser}
          isOpen={modals.main}
          onClose={() => closeModal('main')}
        />
      )}

      {modals.createCustomer && (
        <CreateCustommer
          data={staffModal}
          isOpen={modals.createCustomer}
          onClose={() => closeModal('createCustomer')}
        />
      )}
    </>
  )
}

export default Customer