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
  const { profile } = useContext(AppContext)
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
        <div className={`w-[100%] p-5 tablet:h-[100vh] mobile:h-screen overflow-auto pb-10`}>
          <div className='flex justify-between items-center mb-3'>
            <h1 className='mb-3  text-2xl font-bold dark:text-white'>{title}</h1>
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
                      fill='#000000'
                      height='40'
                      width='40'
                      version='1.1'
                      style={{ paddingBottom: '12px' }}
                      id='Capa_1'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 611.999 611.999'
                    >
                      <g>
                        <g>
                          <g>
                            <path
                              d='M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
				C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
				c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
				h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
				c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
				C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
				c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
				c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
				 M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
				c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
				c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z'
                            />
                            <path
                              d='M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258
				c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258
				C323.259,126.96,315.532,119.235,306.001,119.235z'
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      fill='#000000'
                      height='40'
                      width='40'
                      version='1.1'
                      style={{ paddingBottom: '4px' }}
                      id='Capa_1'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 611.999 611.999'
                    >
                      <g>
                        <g>
                          <g>
                            <path
                              d='M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
				C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
				c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
				h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
				c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
				C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
				c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
				c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
				 M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
				c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
				c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z'
                            />
                            <path
                              d='M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258
				c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258
				C323.259,126.96,315.532,119.235,306.001,119.235z'
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  )}
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
  )
}

export default AdminLayout
