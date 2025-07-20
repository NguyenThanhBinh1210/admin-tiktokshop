/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getAllInOne } from '~/apis/admin.api'
import { FormatNumber } from '~/hooks/useFormatNumber'

const Dashboard = () => {
  const [data, setData] = useState<any>([])
  useQuery({
    queryKey: ['get-all', 2],
    queryFn: () => {
      return getAllInOne()
    },
    onSuccess: (data) => {
      setData(data.data.data)
    },
    cacheTime: 120000
  })

  const dataType = [
    {
      id: 1,
      name: 'Tổng đơn',
      data: data?.coutOrder,
      bg: "bg-green-500",
      img: (
        <svg
          aria-hidden='true'
          className='flex-shrink-0 w-12 h-12 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
            clipRule='evenodd'
          />
        </svg>
      ),
      path: '/order'
    },
    {
      id: 2,
      name: 'Tổng người dùng',
      data: data?.countUser,
      bg: "bg-blue-500",
      img: (
        <svg
          aria-hidden='true'
          className='flex-shrink-0 w-12 h-12 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
        </svg>
      ),
      path: '/custommer'
    },
    {
      id: 3,
      name: 'Tổng nạp',
      bg: "bg-yellow-500",
      data: `${FormatNumber(data?.totalRecharge)}đ`,
      img: (
        <svg width={40} height={40} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_291_1667)'>
            <path
              d='M4.46098 11H2.1C1.49249 11 1 10.5026 1 9.88889V2.11111C1 1.49746 1.49249 1 2.1 1H21.9C22.5075 1 23 1.49746 23 2.11111V9.88889C23 10.5026 22.5075 11 21.9 11H19.8207'
              className='stroke-gray-500'
              strokeWidth={2}
            />
            <path
              d='M19.4286 6H4.57143C4.25583 6 4 6.24551 4 6.54839V22.4516C4 22.7545 4.25583 23 4.57143 23H19.4286C19.7442 23 20 22.7545 20 22.4516V6.54839C20 6.24551 19.7442 6 19.4286 6Z'
              className='stroke-gray-500'
              strokeWidth={2}
            />
            <path
              d='M15 16.3794C15 16.8153 14.8949 17.2259 14.6848 17.6114C14.4825 17.9886 14.179 18.3029 13.7744 18.5543C13.3775 18.7973 12.9066 18.9398 12.3619 18.9817V20H11.6148V18.9691C10.8366 18.8937 10.2101 18.6423 9.73537 18.2149C9.2607 17.779 9.0156 17.1924 9 16.4549H10.751C10.7977 17.0583 11.0856 17.4229 11.6148 17.5486V15.1474C11.0545 14.9966 10.6031 14.8457 10.2607 14.6949C9.9183 14.544 9.62258 14.301 9.37358 13.9657C9.1245 13.6304 9 13.1737 9 12.5954C9 11.8663 9.24128 11.2713 9.72375 10.8103C10.214 10.3493 10.8443 10.0853 11.6148 10.0183V9H12.3619V10.0183C13.109 10.0853 13.7043 10.3284 14.1479 10.7474C14.5992 11.1665 14.8522 11.7447 14.9066 12.4823H13.144C13.1206 12.2393 13.0389 12.0297 12.8988 11.8537C12.7665 11.6693 12.5876 11.5394 12.3619 11.464V13.84C12.9455 13.9993 13.4047 14.1543 13.7393 14.3051C14.0817 14.4476 14.3774 14.6864 14.6264 15.0217C14.8755 15.3486 15 15.8011 15 16.3794ZM10.7043 12.5074C10.7043 12.784 10.7821 13.0103 10.9378 13.1863C11.0934 13.3539 11.3191 13.4922 11.6148 13.6011V11.4263C11.3346 11.4682 11.1128 11.5813 10.9494 11.7657C10.786 11.9501 10.7043 12.1973 10.7043 12.5074ZM12.3619 17.5737C12.6576 17.515 12.8872 17.3851 13.0506 17.184C13.2218 16.9829 13.3074 16.7398 13.3074 16.4549C13.3074 16.1783 13.2256 15.9562 13.0622 15.7886C12.8988 15.621 12.6654 15.4827 12.3619 15.3737V17.5737Z'
              className='fill-gray-500'
            />
          </g>
          <defs>
            <clipPath id='clip0_291_1667'>
              <rect width={24} height={24} fill='white' />
            </clipPath>
          </defs>
        </svg>
      ),
      path: '/payment-history'
    },
    {
      id: 4,
      name: 'Tổng rút',
      bg: "bg-red-400",
      
      data: `${FormatNumber(data?.totalWithdrawal)}đ`,
      img: (
        <svg width='70' height='70' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M15 16.3794C15 16.8153 14.8949 17.2259 14.6848 17.6114C14.4825 17.9886 14.179 18.3029 13.7744 18.5543C13.3775 18.7973 12.9066 18.9398 12.3619 18.9817V20H11.6148V18.9691C10.8366 18.8937 10.2101 18.6423 9.73537 18.2149C9.2607 17.779 9.0156 17.1924 9 16.4549H10.751C10.7977 17.0583 11.0856 17.4229 11.6148 17.5486V15.1474C11.0545 14.9966 10.6031 14.8457 10.2607 14.6949C9.9183 14.544 9.62258 14.301 9.37358 13.9657C9.1245 13.6304 9 13.1737 9 12.5954C9 11.8663 9.24128 11.2713 9.72375 10.8103C10.214 10.3493 10.8443 10.0853 11.6148 10.0183V9H12.3619V10.0183C13.109 10.0853 13.7043 10.3284 14.1479 10.7474C14.5992 11.1665 14.8522 11.7447 14.9066 12.4823H13.144C13.1206 12.2393 13.0389 12.0297 12.8988 11.8537C12.7665 11.6693 12.5876 11.5394 12.3619 11.464V13.84C12.9455 13.9993 13.4047 14.1543 13.7393 14.3051C14.0817 14.4476 14.3774 14.6864 14.6264 15.0217C14.8755 15.3486 15 15.8011 15 16.3794ZM10.7043 12.5074C10.7043 12.784 10.7821 13.0103 10.9378 13.1863C11.0934 13.3539 11.3191 13.4922 11.6148 13.6011V11.4263C11.3346 11.4682 11.1128 11.5813 10.9494 11.7657C10.786 11.9501 10.7043 12.1973 10.7043 12.5074ZM12.3619 17.5737C12.6576 17.515 12.8872 17.3851 13.0506 17.184C13.2218 16.9829 13.3074 16.7398 13.3074 16.4549C13.3074 16.1783 13.2256 15.9562 13.0622 15.7886C12.8988 15.621 12.6654 15.4827 12.3619 15.3737V17.5737Z'
            className='fill-gray-500'
          />
        </svg>
      ),
      path: '/payment-history'
    }
  ]
  return (
    <>
      <div className='grid grid-cols-4 gap-10 tablet:grid-cols-2 mobile:grid-cols-2'>
        {dataType.map((item, index) => (
          <div
            key={index}
            className={`dark:bg-gray-900 ${item.bg} h-[150px] relative dark:border-none border rounded-md shadow-md grid grid-cols-3 gap-x-1`}
          >
            <div className='flex items-center pb-3 justify-center'>{item.img}</div>
            <div className='col-span-2 pb-3 flex gap-y-2 flex-col justify-center items-center'>
              <div className='text-white'>{item.name}</div>
              <div className='text-[16px] font-[600] text-white'>{item.data}</div>
            </div>
            <div className='h-[30px] hover:bg-gray-100 cursor-pointer absolute bottom-0 left-0 w-full mt-auto transition-all bg-slate-100 col-span-3'>
              <Link className='w-full h-full flex items-center justify-center' to={item.path}>
                <span className='cursor-pointer'>Xem thêm</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Dashboard
