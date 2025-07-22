import { useForm } from 'react-hook-form'
import Input from '../components/Input/Input'
import React, { useContext, useState } from 'react'
import { AppContext } from '~/contexts/app.context'
import axios from 'axios'
import { setAccesTokenToLS, setProfileFromLS } from '~/utils/auth'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import { loginAccount } from '~/apis/auth.api'
import { omit } from 'lodash'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({})
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { setIsAuthenticated, setProfile } = React.useContext(AppContext)
  const mutation = useMutation((body: any) => {
    return loginAccount(body)
  })
  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: (dataUser) => {
        console.log(dataUser.data.user)
        const user = dataUser.data.user
        if (user.isAdmin === true || user.isStaff === true) {
          const newUser = omit(dataUser.data.user, ['password'])
          setProfile(newUser)
          toast.success(dataUser.data.message)
          setIsAuthenticated(true)
          navigate('/custommer')
          setTimeout(() => {
            window.location.reload()
          }, 500)

        } else {
          // Handle the case where the user is not an admin within onError
          toast.warn('You do not have admin privileges.')
        }
      },
      onError: (data: any) => {
        toast.warn(data.response.data.errMessage)
      }
    })
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <div
        className={`dark:bg-[#1C1C24] dark:border-none bg-white border
        z-10  mx-auto w-[556px] mobile:w-[327px] rounded-lg flex flex-col px-[60px] py-[50px] mobile:px-[38px]`}
      >
        <h1 className='text-2xl font-bold mx-auto dark:text-white'>Đăng Nhập</h1>
        <form autoComplete='false' onSubmit={handleSubmit(onSubmit)} className='mt-[20px] '>
          <Input
            onFocus={() => setError(null)}
            inputPassword={false}
            register={register}
            placeholder={'example@gmail.com'}
            name='username'
          />
          <Input
            onFocus={() => setError(null)}
            inputPassword={true}
            register={register}
            placeholder={'Password'}
            name='password'
          />
          <div className='py-2 text-red-300'>{error !== null && error}</div>
          <button
            disabled={mutation.isLoading}
            type='submit'
            className='disabled:bg-opacity-70 h-[50px] w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            {mutation.isLoading ? (
              <div>
                <svg
                  aria-hidden='true'
                  role='status'
                  className='inline w-4 h-4 mr-3 text-white animate-spin'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='#E5E7EB'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentColor'
                  />
                </svg>
                Đang chờ...
              </div>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
