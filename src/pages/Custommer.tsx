/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

// APIs
import { deleteStaff, getAllStaff, updateStaff } from '~/apis/product.api'
import { getOnlineUsersDashboard } from '~/apis/admin.api'

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
  isOnline?: boolean
  lastLoginTime?: string
}

interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  width?: string
}

// Constants
const SERVER_URL = 'https://socket.ordersdropship.com'
const ITEMS_PER_PAGE = 8

// Column Configuration
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'stt', label: 'STT', visible: true },
  { key: 'id', label: 'ID', visible: true },
  { key: 'status', label: 'Trạng thái', visible: true, width: 'min-w-[100px]' },
  { key: 'username', label: 'Username', visible: true, width: 'min-w-[140px]' },
  { key: 'idRef', label: 'Người giới thiệu', visible: true, width: 'min-w-[170px]' },
  { key: 'totalAmount', label: 'Số tiền', visible: true },
  { key: 'totalFreeze', label: 'Số tiền đóng băng', visible: true, width: 'min-w-[180px]' },
  { key: 'moneyComissions', label: 'Hoa hồng', visible: true, width: 'min-w-[150px]' },
  { key: 'level', label: 'Level', visible: true, width: 'min-w-[100px]' },
  { key: 'isLook', label: 'Khoá tài khoản', visible: true, width: 'min-w-[120px]' },
  { key: 'isDongBang', label: 'Đóng băng TK', visible: true, width: 'min-w-[140px]' },
  { key: 'logout', label: 'Đăng xuất TK', visible: true, width: 'min-w-[130px]' },
  { key: 'actions', label: 'Hành động', visible: true, width: 'min-w-[130px]' },
  { key: 'orderDay', label: 'Order theo ngày', visible: true },
  { key: 'bank', label: 'Ngân hàng', visible: true, width: 'min-w-[130px]' },
  { key: 'recharge', label: 'Nạp tiền', visible: true }
]

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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [onlineCount, setOnlineCount] = useState(0)

  // Column Toggle State
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)
  const [showColumnToggle, setShowColumnToggle] = useState(false)

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

  // Column Toggle Functions
  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const toggleAllColumns = (visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, visible })))
  }

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS)
  }

  const getVisibleColumns = () => columns.filter(col => col.visible)

  // Save column preferences to localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('customerTableColumns')
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns))
      } catch (error) {
        console.error('Error loading column preferences:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('customerTableColumns', JSON.stringify(columns))
  }, [columns])

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

  // Fetch online users data
  useQuery(
    ['online-users-dashboard'],
    () => getOnlineUsersDashboard(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      onSuccess: (data) => {
        const onlineUserIds = data.data.onlineUsers.map((user: any) => user._id)
        setOnlineUsers(onlineUserIds)
        setOnlineCount(data.data.summary.onlineCount)

        // Update staff with online status
        setStaff(prevStaff =>
          prevStaff.map(user => ({
            ...user,
            isOnline: onlineUserIds.includes(user._id)
          }))
        )
      }
    }
  )

  // Setup socket connection for real-time updates
  useEffect(() => {
    const socket = io(SERVER_URL)

    socket.on('user-came-online', (data) => {
      setOnlineUsers(prev => [...prev, data.user.id])
      setOnlineCount(data.onlineCount)

      // Update staff with online status
      setStaff(prevStaff =>
        prevStaff.map(user => ({
          ...user,
          isOnline: user._id === data.user.id ? true : user.isOnline
        }))
      )
    })

    socket.on('user-went-offline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.user.id))
      setOnlineCount(data.onlineCount)

      // Update staff with online status
      setStaff(prevStaff =>
        prevStaff.map(user => ({
          ...user,
          isOnline: user._id === data.user.id ? false : user.isOnline
        }))
      )
    })

    return () => {
      socket.off('user-came-online')
      socket.off('user-went-offline')
      socket.disconnect()
    }
  }, [])

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
    queryClient.invalidateQueries(['online-users-dashboard'])
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

  // Column Toggle Component
  const ColumnTogglePanel = () => (
    <div className="relative">
      <button
        onClick={() => setShowColumnToggle(!showColumnToggle)}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Cột hiển thị
      </button>

      {showColumnToggle && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[250px]">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Tùy chọn cột</h3>
              <button
                onClick={() => setShowColumnToggle(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => toggleAllColumns(true)}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                Hiện tất cả
              </button>
              <button
                onClick={() => toggleAllColumns(false)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Ẩn tất cả
              </button>
              <button
                onClick={resetColumns}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Đặt lại
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {columns.map((column) => (
                <label key={column.key} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.key)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Hiển thị: {getVisibleColumns().length}/{columns.length} cột
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render table cell based on column key
  const renderTableCell = (item: Customer, column: ColumnConfig, idx: number) => {
    switch (column.key) {
      case 'stt':
        return <td key={column.key} className="pl-6 py-3">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>

      case 'id':
        return <td key={column.key} className="px-3 py-3 text-xs">{item._id}</td>

      case 'status':
        return (
          <td key={column.key} className="px-3 py-3">
            <div className={`status-badge ${item.isOnline ? 'online-badge' : 'offline-badge'}`}>
              {item.isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </div>
          </td>
        )

      case 'username':
        return <td key={column.key} className="px-3 py-3 font-medium">{item.username}</td>

      case 'idRef':
        return <td key={column.key} className="px-6 py-3">{item.idRef}</td>

      case 'totalAmount':
        return (
          <td key={column.key} className="px-6 py-3 text-green-500 font-medium">
            {formatCurrency(item.totalAmount)}
          </td>
        )

      case 'totalFreeze':
        return (
          <td key={column.key} className="px-6 py-3 text-orange-500 font-medium">
            {formatCurrency(item.totalFreeze)}
          </td>
        )

      case 'moneyComissions':
        return (
          <td key={column.key} className="px-6 py-3 text-blue-500 font-medium">
            {formatCurrency(item.moneyComissions)}
          </td>
        )

      case 'level':
        return (
          <td key={column.key} className="px-2 py-3">
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
        )

      case 'isLook':
        return (
          <td key={column.key} className="px-3 py-3">
            {renderToggleSwitch(
              item,
              'isLook',
              'Mở',
              'Khoá',
              `đã ${item.isLook ? 'mở' : 'khoá'} tài khoản ${item.username}`
            )}
          </td>
        )

      case 'isDongBang':
        return (
          <td key={column.key} className="px-3 py-3">
            {renderToggleSwitch(
              item,
              'isDongBang',
              'Mở',
              'Đóng băng',
              `đã ${item.isDongBang ? 'mở đóng băng' : 'đóng băng'} tài khoản ${item.username}`
            )}
          </td>
        )

      case 'logout':
        return (
          <td key={column.key} className="px-3 py-3">
            <button
              className="w-32 h-10 font-medium text-white rounded-md transition-all duration-300 bg-red-500 hover:bg-red-600"
              onClick={() => logoutUser(item)}
            >
              Đăng xuất
            </button>
          </td>
        )

      case 'actions':
        return (
          <td key={column.key} className="px-6 py-3 text-center">
            {renderActionButtons(item)}
          </td>
        )

      case 'orderDay':
        return (
          <td key={column.key} className="px-6 py-3 text-center">
            <button
              type="button"
              onClick={() => openModal('orderDay', item)}
              className="bg-purple-400 hover:bg-purple-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
            >
              Thiết lập
            </button>
          </td>
        )

      case 'bank':
        return (
          <td key={column.key} className="px-6 py-3 text-center">
            <button
              type="button"
              onClick={() => openModal('main', item)}
              className="bg-blue-400 hover:bg-blue-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
            >
              Tác động
            </button>
          </td>
        )

      case 'recharge':
        return (
          <td key={column.key} className="px-6 py-3 text-center">
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
        )

      default:
        return null
    }
  }

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
                  <div className="ml-auto flex items-center gap-3">
                    <div className="bg-gray-100 px-4 py-2 rounded-md shadow-md">
                      <span className="font-medium">Đang online: </span>
                      <span className="text-green-600 font-bold">{onlineCount}</span>
                    </div>
                    <ColumnTogglePanel />
                  </div>
                </div>

                {/* Online users summary */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-lg font-semibold mb-2">Thống kê người dùng online</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-50 p-3 rounded-md border border-green-200">
                      <div className="text-sm text-gray-600">Tổng số online</div>
                      <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <div className="text-sm text-gray-600">Tỉ lệ online</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {data?.data?.count ? Math.round((onlineCount / data.data.count) * 100) : 0}%
                      </div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Trực tuyến</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                        <span className="text-sm">Ngoại tuyến</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        {getVisibleColumns().map((column) => (
                          <th
                            key={column.key}
                            scope="col"
                            className={`px-3 py-3 ${column.width || ''} ${column.key === 'stt' ? 'pl-6' : ''
                              } ${['actions', 'orderDay', 'bank', 'recharge'].includes(column.key) ? 'text-center' : ''
                              }`}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((item: Customer, idx: number) => (
                        <tr
                          key={item._id}
                          className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${item.isOnline ? 'bg-green-50 dark:bg-gray-800/80' : 'bg-white dark:bg-gray-800'
                            }`}
                        >
                          {getVisibleColumns().map((column) =>
                            renderTableCell(item, column, idx)
                          )}
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

      {/* Click outside handler for column toggle */}
      {showColumnToggle && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColumnToggle(false)}
        />
      )}

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

      {/* Additional CSS for column toggle styling */}
      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .online-badge {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        
        .offline-badge {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .online-badge::before {
          content: '●';
          color: #22c55e;
          margin-right: 4px;
        }
        
        .offline-badge::before {
          content: '●';
          color: #9ca3af;
          margin-right: 4px;
        }
      `}</style>
    </>
  )
}

export default Customer