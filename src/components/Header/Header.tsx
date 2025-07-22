import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '~/contexts/app.context'
import useDarkMode from '~/hooks/useDarkMode'
import { clearLS } from '~/utils/auth'

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { profile, reset } = useContext(AppContext)
  const navigate = useNavigate()
  const handleLogout = () => {
    clearLS()
    reset()
    toast.success('Đăng xuất thành công!')
    navigate('/login')
  }
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    })
  }, [])
  return (
    <div
      ref={modalRef}
      id='drawer-navigation'
      className={`${showMenu ? 'mobile:translate-x-[0] ' : 'mobile:translate-x-[-100%] '
        } dark:bg-gray-700 mobile:fixed non-scroll dark:border-none border-r border-gray-300 top-0 sticky left-0 z-40 h-screen p-4  transition-all  bg-white w-60 mobile:w-[240px]`}
      tabIndex={-1}
      aria-labelledby='drawer-navigation-label'
    >
      <div
        id='drawer-navigation-label'
        style={{ textAlign: 'center' }}
        className={` ${showMenu ? 'hidden' : ''
          } text-blue-400 flex justify-between items-center text-base font-semibold uppercase dark:text-gray-400 `}
      >
        {profile?.isAdmin && profile?.isStaff ? (
          <h2 style={{ margin: 'auto' }}>
            <Link to='/'>SuperAdmin</Link>{' '}
          </h2>
        ) : (
          <></>
        )}
        {profile?.isAdmin && !profile?.isStaff ? (
          <h2 style={{ margin: 'auto' }}>
            <Link to='/'>Admin</Link>{' '}
          </h2>
        ) : (
          <></>
        )}
        {profile?.isStaff && !profile?.isAdmin ? <h2 style={{ margin: 'auto' }}>Nhân viên</h2> : <></>}
      </div>
      <div className='py-4 overflow-y-auto flex flex-col justify-between h-[100%]'>
        <ul className='space-y-2'>
          {profile?.isAdmin ||
            (profile?.isAdmin && (
              <li>
                <Link
                  to='/'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  <button>Dashboard</button>
                </Link>
              </li>
            ))}
          {profile?.isAdmin && profile?.isStaff ? (
            <>
              <li>
                <Link
                  to='/luu-vet'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  <button>Lịch sử hoạt động</button>
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
          {profile?.isAdmin && (
            <>
              <li>
                <Link
                  to='/'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  <button>Dashboard</button>
                </Link>
              </li>
              <li>
                <Link
                  to='/user'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  <button>Nhân viên</button>
                </Link>
              </li>
              {/* <li>
                <Link
                  to='/id-ref'
                  className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                >
                  <button>Mã giới thiệu</button>
                </Link>
              </li> */}
            </>
          )}
          {/* <li>
            <Link
              to='/ip'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Ip</button>
            </Link>
          </li> */}
          <li>
            <Link
              to='/custommer'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Khách hàng</button>
            </Link>
          </li>
          <li>
            <Link
              to='/facebook-customer'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Facebook KH</button>
            </Link>
          </li>
          {/* <li>
            <Link
              to='/add-product'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Đăng kí bán hàng</button>
            </Link>
          </li> */}
          <li>
            <Link
              to='/product'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Sản Phẩm</button>
            </Link>
          </li>
          <li>
            <Link
              to='/set-order-product'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Lịch sử thêm đơn</button>
            </Link>
          </li>
          <li>
            <Link
              to='/payment-history'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Lịch sử Nạp / Rút</button>
            </Link>
          </li>

          <li>
            <Link
              to='/order'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Lịch sử đặt hàng</button>
            </Link>
          </li>
          <li>
            <Link
              to='/order-special'
              className='flex items-center w-full p-2 text-base  text-left font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button className='text-left'>Lịch sử đặt hàng đặc biệt</button>
            </Link>
          </li>
          {/* {profile?.isAdmin && <li>
            <Link
              to='/message'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Tin nhắn</button>
            </Link>
          </li>}
          {profile?.isStaff && !profile?.isAdmin && <li>
            <Link
              to='/message-customer'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Tin nhắn</button>
            </Link>
          </li>} */}
          <li>
            <Link
              to='/notify'
              className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
            >
              <button>Thông báo</button>
            </Link>
          </li>
          {profile?.isAdmin && (
            <li>
              <Link
                to='/settings'
                className='flex gap-x-3 pl-4 items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <div>Cấu hình</div>
              </Link>
            </li>
          )}
        </ul>
        <ul className='mt-auto'>
          <li className=''>
            <button onClick={toggleDarkMode} className='w-full'>
              {isDarkMode ? (
                <div className='flex gap-x-3 items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 18.5455C10.264 18.5455 8.59918 17.8558 7.37166 16.6283C6.14415 15.4008 5.45455 13.736 5.45455 12C5.45455 10.264 6.14415 8.59918 7.37166 7.37166C8.59918 6.14415 10.264 5.45455 12 5.45455C13.736 5.45455 15.4008 6.14415 16.6283 7.37166C17.8558 8.59918 18.5455 10.264 18.5455 12C18.5455 13.736 17.8558 15.4008 16.6283 16.6283C15.4008 17.8558 13.736 18.5455 12 18.5455ZM12 16.3636C13.1573 16.3636 14.2672 15.9039 15.0856 15.0856C15.9039 14.2672 16.3636 13.1573 16.3636 12C16.3636 10.8427 15.9039 9.73278 15.0856 8.91444C14.2672 8.0961 13.1573 7.63636 12 7.63636C10.8427 7.63636 9.73278 8.0961 8.91444 8.91444C8.0961 9.73278 7.63636 10.8427 7.63636 12C7.63636 13.1573 8.0961 14.2672 8.91444 15.0856C9.73278 15.9039 10.8427 16.3636 12 16.3636ZM10.9091 1.09091C10.9091 0.488417 11.3975 0 12 0V0C12.6025 0 13.0909 0.488417 13.0909 1.09091V2.18182C13.0909 2.78431 12.6025 3.27273 12 3.27273V3.27273C11.3975 3.27273 10.9091 2.78431 10.9091 2.18182V1.09091ZM10.9091 21.8182C10.9091 21.2157 11.3975 20.7273 12 20.7273V20.7273C12.6025 20.7273 13.0909 21.2157 13.0909 21.8182V22.9091C13.0909 23.5116 12.6025 24 12 24V24C11.3975 24 10.9091 23.5116 10.9091 22.9091V21.8182ZM3.51491 5.05745C3.08895 4.63149 3.08895 3.94087 3.51491 3.51491V3.51491C3.94087 3.08895 4.63149 3.08895 5.05745 3.51491L5.82873 4.28618C6.25469 4.71214 6.25469 5.40277 5.82873 5.82873V5.82873C5.40277 6.25469 4.71214 6.25469 4.28618 5.82873L3.51491 5.05745ZM18.1713 19.7138C17.7453 19.2879 17.7453 18.5972 18.1713 18.1713V18.1713C18.5972 17.7453 19.2879 17.7453 19.7138 18.1713L20.4851 18.9425C20.9111 19.3685 20.9111 20.0591 20.4851 20.4851V20.4851C20.0591 20.9111 19.3685 20.9111 18.9425 20.4851L18.1713 19.7138ZM18.9421 3.51464C19.3682 3.0883 20.0594 3.08834 20.4855 3.51473V3.51473C20.9113 3.94083 20.9111 4.63141 20.4852 5.05736L19.7139 5.82864C19.2879 6.25465 18.5972 6.25465 18.1712 5.82864V5.82864C17.7452 5.4027 17.7452 4.71213 18.171 4.28609L18.9421 3.51464ZM4.28618 18.1713C4.71214 17.7453 5.40277 17.7453 5.82873 18.1713V18.1713C6.25469 18.5972 6.25469 19.2879 5.82873 19.7138L5.05746 20.4851C4.63149 20.9111 3.94087 20.9111 3.51491 20.4851V20.4851C3.08895 20.0591 3.08895 19.3685 3.51491 18.9425L4.28618 18.1713ZM22.9091 10.9091C23.5116 10.9091 24 11.3975 24 12V12C24 12.6025 23.5116 13.0909 22.9091 13.0909H21.8182C21.2157 13.0909 20.7273 12.6025 20.7273 12V12C20.7273 11.3975 21.2157 10.9091 21.8182 10.9091H22.9091ZM2.18182 10.9091C2.78431 10.9091 3.27273 11.3975 3.27273 12V12C3.27273 12.6025 2.78431 13.0909 2.18182 13.0909H1.09091C0.488417 13.0909 0 12.6025 0 12V12C0 11.3975 0.488417 10.9091 1.09091 10.9091H2.18182Z'
                      fill='#A2A2A8'
                    />
                  </svg>
                  <div>Tối</div>
                </div>
              ) : (
                <div className='flex gap-x-3 items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M9.6 6C9.59976 7.66877 10.0966 9.29979 11.0271 10.6851C11.9576 12.0703 13.2796 13.147 14.8245 13.7779C16.3695 14.4087 18.0673 14.5651 19.7015 14.2271C21.1161 13.9345 22.4275 13.3728 23.512 12.4539C23.698 12.2963 24 12.4229 24 12.6667C24 19.2943 18.6276 24 12 24C5.3724 24 0 18.6276 0 12C0 5.3724 4.70573 0 11.3333 0C11.6208 0 11.7699 0.35622 11.5841 0.575553C11.0336 1.22558 10.5844 1.95701 10.2534 2.74522C9.82058 3.77568 9.59843 4.88234 9.6 6ZM2.4 12C2.39913 14.142 3.11463 16.2227 4.43267 17.9112C5.75071 19.5996 7.59556 20.7987 9.67369 21.3178C11.7518 21.8368 13.9439 21.646 15.901 20.7756C17.8582 19.9052 19.468 18.4052 20.4744 16.5144C18.6833 16.9364 16.8141 16.8937 15.0442 16.3905C13.2742 15.8872 11.6622 14.9401 10.3611 13.6389C9.0599 12.3378 8.11278 10.7258 7.60954 8.95581C7.1063 7.18586 7.06364 5.31667 7.4856 3.5256C5.94909 4.34416 4.66414 5.5652 3.76831 7.05797C2.87247 8.55075 2.39949 10.2591 2.4 12Z'
                      fill='#A2A2A8'
                    />
                  </svg>
                  <div>Sáng</div>
                </div>
              )}
            </button>
          </li>
          <li>
            <Link
              to=''
              onClick={() => handleLogout()}
              className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <svg
                aria-hidden='true'
                className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='flex-1 ml-3 whitespace-nowrap'>Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
      <button
        type='button'
        onClick={() => setShowMenu(!showMenu)}
        className='absolute mobile:block hidden right-[-100px] bottom-[20px] text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
      >
        {!showMenu ? 'Menu' : 'Đóng'}
      </button>
    </div>
  )
}

export default Header
