import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '~/contexts/app.context'
import useDarkMode from '~/hooks/useDarkMode'
import { clearLS } from '~/utils/auth'

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { profile, reset, navbarCollapsed, setNavbarCollapsed } = useContext(AppContext)
  const navigate = useNavigate()
  const handleLogout = () => {
    clearLS()
    reset()
    toast.success('Đăng xuất thành công!')
    navigate('/login')
  }
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const modalRef = useRef<HTMLDivElement>(null)

  // Toggle navbar cho desktop
  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    })
  }, [])

  // Component cho menu item với tooltip
  const NavMenuItem = ({ to, icon, label, onClick }: { to?: string, icon: React.ReactNode, label: string, onClick?: () => void }) => {
    const content = (
      <div className={`flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 relative ${
        navbarCollapsed ? 'justify-center py-3 px-2' : 'pl-4 pr-2 py-2'
      }`}>
        <div className={`flex-shrink-0 flex items-center justify-center ${navbarCollapsed ? 'nav-icon-collapsed' : 'nav-icon'}`}>
          {icon}
        </div>
        <span className={`ml-3 ${navbarCollapsed ? 'tablet:hidden desktop:hidden' : ''} whitespace-nowrap`}>{label}</span>
        
        {/* Tooltip cho collapsed mode */}
        {navbarCollapsed && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-900 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap tablet:block desktop:block hidden shadow-lg">
            {label}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        )}
      </div>
    )

    if (onClick) {
      return <button onClick={onClick} className="w-full text-left" title={label}>{content}</button>
    }

    return (
      <Link to={to || '/'} className="block" title={label}>
        {content}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {showMenu && (
        <div
          className="mobile:fixed mobile:inset-0 mobile:bg-gray-600 mobile:bg-opacity-50 mobile:z-30 mobile:block hidden mobile-overlay"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <div
        ref={modalRef}
        id='drawer-navigation'
        className={`${
          // Mobile behavior
          showMenu ? 'mobile:translate-x-[0] ' : 'mobile:translate-x-[-100%] '
        } ${
          // Desktop behavior
          navbarCollapsed ? 'tablet:w-20 w-20' : 'tablet:w-60 w-60'
        } dark:bg-gray-700 mobile:fixed non-scroll dark:border-none border-r border-gray-300 top-0 sticky left-0 z-40 h-screen p-4 navbar-transition bg-white mobile:w-[240px]`}
        tabIndex={-1}
        aria-labelledby='drawer-navigation-label'
      >
        {/* Header with toggle button for desktop */}
        <div className="flex items-center justify-between mb-4">
          <div
            id='drawer-navigation-label'
            className={`${navbarCollapsed ? 'tablet:hidden desktop:hidden' : ''} ${showMenu ? 'hidden' : ''} text-blue-400 flex justify-center items-center text-base font-semibold uppercase dark:text-gray-400 flex-1`}
          >
            {profile?.isAdmin && profile?.isStaff ? (
              <h2>
                <Link to='/'>SuperAdmin</Link>
              </h2>
            ) : (
              <></>
            )}
            {profile?.isAdmin && !profile?.isStaff ? (
              <h2>
                <Link to='/'>Admin</Link>
              </h2>
            ) : (
              <></>
            )}
            {profile?.isStaff && !profile?.isAdmin ? <h2>Nhân viên</h2> : <></>}
          </div>
          
          {/* Desktop toggle button */}
          <button
            type='button'
            onClick={toggleNavbar}
            className={`mobile:hidden tablet:flex desktop:flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-all duration-200 ${
              navbarCollapsed ? 'w-10 h-10' : 'w-8 h-8'
            }`}
            aria-label="Toggle navigation"
          >
            <svg className={`${navbarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className='py-4 overflow-y-auto h-full sidebar-scroll'>
          <ul className='space-y-2'>
            {(profile?.isAdmin || profile?.isAdmin) && (
              <li>
                <NavMenuItem
                  to="/"
                  icon={
                    <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                  }
                  label="Dashboard"
                />
              </li>
            )}

            {profile?.isAdmin && profile?.isStaff && (
              <li>
                <NavMenuItem
                  to="/luu-vet"
                  icon={
                    <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                  }
                  label="Lịch sử hoạt động"
                />
              </li>
            )}
            
            <li>
              <NavMenuItem
                to="/user"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                }
                label="Nhân viên"
              />
            </li>
            
            <li>
              <NavMenuItem
                to="/custommer"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Khách hàng"
              />
            </li>
            
            <li>
              <NavMenuItem
                to="/facebook-customer"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                }
                label="Facebook KH"
              />
            </li>
            
            <li>
              <NavMenuItem
                to="/product"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Sản Phẩm"
              />
            </li>

            <li>
              <NavMenuItem
                to="/set-order-product"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Lịch sử thêm đơn"
              />
            </li>

            <li>
              <NavMenuItem
                to="/payment-history"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"></path>
                    <path d="M6 8a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm2 0v4h6V8H8z"></path>
                  </svg>
                }
                label="Lịch sử Nạp / Rút"
              />
            </li>

            <li>
              <NavMenuItem
                to="/order"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Lịch sử đặt hàng"
              />
            </li>

            <li>
              <NavMenuItem
                to="/order-special"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Lịch sử đặt hàng đặc biệt"
              />
            </li>
            
            <li>
              <NavMenuItem
                to="/notify"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                  </svg>
                }
                label="Thông báo"
              />
            </li>
            
            <li>
              <NavMenuItem
                to="/settings"
                icon={
                  <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Cấu hình"
              />
            </li>
          </ul>
          
          <ul className='mt-auto space-y-2'>
            <li>
              <NavMenuItem
                icon={
                  isDarkMode ? (
                    <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg className="w-full h-full text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                  )
                }
                label={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                onClick={toggleDarkMode}
              />
            </li>
            <li>
              <NavMenuItem
                icon={
                  <svg
                    className='w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                }
                label="Đăng xuất"
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
        
        {/* Mobile toggle button */}
        <button
          type='button'
          onClick={toggleMobileMenu}
          className='absolute mobile:block hidden right-[-50px] top-4 text-white bg-blue-600 border border-blue-600 focus:outline-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          aria-label="Toggle mobile menu"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default Header
