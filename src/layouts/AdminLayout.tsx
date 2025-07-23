import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Header from '~/components/Header/Header'
import ProfileModal from '~/components/Modal/ProfileModal'
import { AppContext } from '~/contexts/app.context'
import { getProfile } from '~/apis/product.api'
import { createMessage, getCountChat, uploadImage } from '~/apis/chat.api'
import Loading from '~/components/Loading/Loading'
import io from 'socket.io-client'
interface Props {
  children?: React.ReactNode
  title: string
}
const serverUrl = 'https://socket.ordersdropship.com'
const AdminLayout = ({ children, title }: Props) => {
  const { profile, navbarCollapsed } = useContext(AppContext)
  const [isModalOpen, setModalOpen] = useState(false)
  const [profiles, setProfiles] = useState<any>(null)
  const [countMessage, setCountMessage] = useState<any>()
  const queryClient = useQueryClient()
  const { isLoading } = useQuery({
    queryKey: ['profile', 3],
    cacheTime: 1000,
    queryFn: () => getProfile(),
    onSuccess: (data: any) => {
      setProfiles(data?.data.user)
    }
  })
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfile()
        setProfiles(data?.data.user)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      }
    }

    fetchProfiles()
  }, [])
  useQuery({
    queryKey: ['message-chat', 3],
    queryFn: () => getCountChat(),
    onSuccess: (data: any) => {
      setCountMessage(data?.data.count)
    },
    cacheTime: 60000
  })
  useEffect(() => {
    const socket = io(serverUrl)
    socket.on('receiveMessAdmin', (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['message-chat', 3] })
      queryClient.invalidateQueries({ queryKey: ['message', 5] })
    })
    socket.on('receiveImageAdmin', (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['message-chat', 3] })
      queryClient.invalidateQueries({ queryKey: ['message', 5] })
    })
  }, [queryClient])
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['message-chat', 3] })
    }, 3000)
    return () => clearInterval(intervalId)
  }, [queryClient])
  if (isLoading) {
    return (
      <div className='pt-60'>
        <Loading></Loading>
      </div>
    )
  }
  return (
    <div>
      <div className='flex dark:bg-gray-800'>
        <Header />
        <div className={`${navbarCollapsed ? 'tablet:ml-10 ml-10' : 'tablet:ml-0 ml-0'} mobile:ml-0 w-full tablet:h-[100vh] mobile:h-screen overflow-auto content-transition`}>
          <div className='p-5'>
            <div className='flex justify-between items-center mb-3'>
              <h1 className='mb-3 text-2xl font-bold dark:text-white'>{title}</h1>
              <div className='flex items-center space-x-4'>
                <Link to='/message' className='flex items-center space-x-4'>
                  <div className='grid-cols-2 items-center text-right'>
                    {countMessage > 0 ? (
                      <span className='text-rose-400 pt-2 font-bold text-base'>{countMessage}</span>
                    ) : (
                      ''
                    )}
                    {countMessage > 0 ? (
                      <svg
                        className="w-10 h-10 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                                          ) : null}
                  </div>
                </Link>
                <button className='flex items-center space-x-4' onClick={() => setModalOpen(true)}>
                  <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'>
                    {profiles?.avatar[0] == null && (
                      <svg
                        className='absolute w-12 h-12 text-gray-400 -left-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                          clipRule='evenodd'
                        ></path>
                      </svg>
                    )}
                    {profiles?.avatar[0] && <img src={profiles.avatar[0]} alt='profile' />}
                  </div>
                  <div className='font-medium dark:text-white'>
                    <div>{profile?.name}</div>
                  </div>
                </button>
              </div>
            </div>
            {children}
            <ProfileModal data={profiles} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
