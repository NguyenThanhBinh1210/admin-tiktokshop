import { Content } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import {
  getCountDown,
  getTiso,
  updateCountDown,
  updateTiso,
  updateRandomProduct,
  updateRandomFaction,
  updateRandomClient,
  getRandomClient,
  getRandomProduct,
  getRandomFaction,
  getGioiHan,
  updateGioiHan,
  updateStartPoint,
  getStartPoint,
  updateCFMess,
  getCFMess,
  getTime,
  updateTime,
  updateGioiHanThem,
  getGioiHanThem,
  updateCommission,
  getCommission,
  getNewbiePercentage,
  updateNewbiePercentage,
  getOrderCommission,
  updateOrderCommission,
  getReferralPercentage,
  updateReferralPercentage,
  getNewcomerCommission,
  updateNewcomerCommission,
  getNumberOrder,
  updateNumberOrder,
  getOrderPercentage,
  updateOrderPercentage
} from '~/apis/setting.api'
import Dropdown from '../components/Dropdown/Dropdown'
const Settings = () => {
  const [cowndown, setCoundown] = useState<any>()
  const [message, setMessage] = useState<any>()
  const [tiso, setTiso] = useState<any>()
  const [commission, setCommission] = useState<any>()
  const [show, setShow] = useState<boolean>(false)
  const [show1, setShow1] = useState<boolean>(false)
  const [show2, setShow2] = useState<boolean>(false)
  const [showMess, setShowMess] = useState<boolean>(false)
  const [show3, setShow3] = useState<boolean>(false)
  const [show4, setShow4] = useState<boolean>(false)
  const [show5, setShow5] = useState<boolean>(false)
  const [show6, setShow6] = useState<boolean>(false)
  const [show7, setShow7] = useState<boolean>(false)
  const [show8, setShow8] = useState<boolean>(false)
  const [show9, setShow9] = useState<boolean>(false)

  const [client, setClient] = useState<any>()

  const [gioihan, setGioihan] = useState<any>()
  const [gioihanthem, setGioihanThem] = useState<any>()
  const [newcomer, setNewcomer] = useState<any>()
  const [newcomerCommission, setNewcomerCommissions] = useState<any>()
  const [percent, setpercent] = useState<any>()
  const [orderCommission, setOrderCommission] = useState<any>()
  const [faction, setFaction] = useState<any>()
  const [point, setPoint] = useState<any>()
  const [time, setTime] = useState<any>()
  const [selectedOption, setSelectedOption] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [numberOrder, setNumberOrder] = useState<any>()
  const [orderPercentage, setOrderPercentage] = useState<any>()
  console.log('orderPercentage', orderPercentage)
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
    setShow(true)
  }
  useEffect(() => {
    if (selectedOption) {
      setInputValue((selectedOption as { ratio: string }).ratio)
    }
  }, [selectedOption])

  const handleSelect = (option: any) => {
    setSelectedOption(option)
    // if (selectedOption) {
    //   setInputValue((selectedOption as { ratio: string }).ratio)
    // }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (selectedOption !== null) {
      const selectedOptionData = selectedOption as { level: string }
      const body = {
        level: selectedOptionData.level,
        ratio: inputValue,
        activate: `cấu hình tỉ lệ hoa hồng theo lv level ${selectedOptionData.level} với ${inputValue}%`,
        nameUser: ''
      }
      mutationUpdateCommission.mutate(body, {
        onSuccess: () => {
          setShow(false)
          toast.success('Cập nhật tỉ lệ thành công ')
          refetchCommission()
        },
        onError: () => {
          toast.warning('Lỗi, hãy thử lại!')
        }
      })
      // Tiếp tục xử lý dữ liệu hoặc gửi body đến server
    }
  }
  const { refetch: refetchCommission } = useQuery({
    queryKey: ['get-setting-faction'],
    queryFn: () => {
      return getCommission()
    },
    onSuccess: (data) => {
      setCommission(data.data)
    }
  })
  const mutationUpdateCommission = useMutation((body: any) => {
    return updateCommission(body)
  })

  useQuery({
    queryKey: ['get-setting-faction'],
    queryFn: () => {
      return getCommission()
    },
    onSuccess: (data) => {
      setCommission(data.data)
    }
  })
  //newcomer
  useQuery({
    queryKey: ['get-setting-newcomer'],
    queryFn: () => {
      return getNewbiePercentage()
    },
    onSuccess: (data) => {
      setNewcomer(data.data.ratio)
    }
  })
  const mutationUpdateNewcomer = useMutation((body: any) => {
    return updateNewbiePercentage(body)
  })
  const handleUpdateNewComer = () => {
    const body = {
      ratio: newcomer,
      activate: `cấu hình Tỉ lệ hoa hồng người mới với ${newcomer}%`,
      nameUser: ''
    }
    mutationUpdateNewcomer.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật tỉ lệ người mới thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  //newcomer commission
  useQuery({
    queryKey: ['get-setting-newcomer-commission'],
    queryFn: () => {
      return getNewcomerCommission()
    },
    onSuccess: (data) => {
      setNewcomerCommissions(data.data.money)
    }
  })
  const mutationUpdateNewcomerCommission = useMutation((body: any) => {
    return updateNewcomerCommission(body)
  })
  const handleUpdateNewcomerCommission = () => {
    const body = {
      money: newcomerCommission,
      activate: `Giới hạn để nhận hoa hồng với người mới
      với ${newcomerCommission}%`,
      nameUser: ''
    }
    mutationUpdateNewcomerCommission.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật hoa hồng người mới thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  //OrderCommission
  useQuery({
    queryKey: ['get-setting-order-commission'],
    queryFn: () => {
      return getOrderCommission()
    },
    onSuccess: (data) => {
      setOrderCommission(data.data.ratio)
    }
  })
  const mutationUpdateOrderCommission = useMutation((body: any) => {
    return updateOrderCommission(body)
  })
  const handleUpdateOrderCommission = () => {
    const body = {
      ratio: orderCommission,
      activate: `Tỉ lệ % hoa hồng giới thiệu / 1 người (%)
      ${orderCommission}%`,
      nameUser: ''
    }
    mutationUpdateOrderCommission.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật % hoa hồng giới thiệu thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  // ReferralPercentage
  useQuery({
    queryKey: ['get-setting-order-Referral-Percentage'],
    queryFn: () => {
      return getReferralPercentage()
    },
    onSuccess: (data) => {
      setpercent(data.data.ratio)
    }
  })
  const mutationUpdateReferralPercentage = useMutation((body: any) => {
    return updateReferralPercentage(body)
  })
  const handleUpdateReferralPercentage = () => {
    const body = {
      ratio: percent,
      activate: `cấu hình Hoa hồng / đơn hàng (%)
      với ${percent}%`,
      nameUser: ''
    }
    mutationUpdateReferralPercentage.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật Hoa hồng / đơn hàng (%) thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  // NumberOrder
  useQuery({
    queryKey: ['get-setting-number-order'],
    queryFn: () => {
      return getNumberOrder()
    },
    onSuccess: (data) => {
      setNumberOrder(data.data.number)
    }
  })
  const mutationUpdateNumberOrder = useMutation((body: any) => {
    return updateNumberOrder(body)
  })
  const handleUpdateNumberOrder = () => {
    const body = {
      number: numberOrder,
      activate: `Số lượng đơn hàng được order trong 1 ngày ${numberOrder}`,
      nameUser: ''
    }
    mutationUpdateNumberOrder.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật số lượt order thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }

  // OrderPercentage
  useQuery({
    queryKey: ['get-setting-order-Percentage'],
    queryFn: () => {
      return getOrderPercentage()
    },
    onSuccess: (data) => {
      setOrderPercentage(data.data.ratio)
    }
  })
  const mutationUpdateOrderPercentage = useMutation((body: any) => {
    return updateOrderPercentage(body)
  })
  const handleUpdateOrderPercentage = () => {
    const body = {
      ratio: orderPercentage,
      activate: `cấu hình phần trăm số tiền tối thiểu mỗi lần khách hàng order ${orderPercentage}%`,
      nameUser: ''
    }
    mutationUpdateOrderPercentage.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật số lượt order thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  //
  useQuery({
    queryKey: ['get-setting-commission'],
    queryFn: () => {
      return getRandomFaction()
    },
    onSuccess: (data) => {
      setFaction(data.data.number)
    }
  })
  useQuery({
    queryKey: ['get-setting-time'],
    queryFn: () => {
      return getTime()
    },
    onSuccess: (data) => {
      setTime(data.data.time)
    }
  })
  useQuery({
    queryKey: ['get-gioi-han'],
    queryFn: () => {
      return getGioiHan()
    },
    onSuccess: (data) => {
      setGioihan(data.data.number)
    }
  })

  useQuery({
    queryKey: ['get-gioi-han-them'],
    queryFn: () => {
      return getGioiHanThem()
    },
    onSuccess: (data) => {
      setGioihanThem(data.data.number)
    }
  })

  useQuery({
    queryKey: ['get-cf-message'],
    queryFn: () => {
      return getCFMess()
    },
    onSuccess: (data) => {
      setMessage(data.data[0].content)
    }
  })
  useQuery({
    queryKey: ['get-setting-client'],
    queryFn: () => {
      return getRandomClient()
    },
    onSuccess: (data) => {
      setClient(data.data.number)
    }
  })
  useQuery({
    queryKey: ['get-countdown'],
    queryFn: () => {
      return getCountDown()
    },
    onSuccess: (data) => {
      setCoundown(data.data.countdown)
    }
  })
  useQuery({
    queryKey: ['get-start-point'],
    queryFn: () => {
      return getStartPoint()
    },
    onSuccess: (data) => {
      setPoint(data.data.point)
    }
  })
  useQuery({
    queryKey: ['get-tiso'],
    queryFn: () => {
      return getTiso()
    },
    onSuccess: (data) => {
      setTiso(data.data[0].numberOder)
    }
  })
  const mutationUpdateTime = useMutation((body: any) => {
    return updateTime(body)
  })
  const mutationUpdateTiso = useMutation((body: any) => {
    return updateTiso(body)
  })
  const mutationUpdateProduct = useMutation((body: any) => {
    return updateRandomProduct(body)
  })
  const mutationUpdateFaction = useMutation((body: any) => {
    return updateRandomFaction(body)
  })
  const mutationUpdateCountDown = useMutation((body: any) => {
    return updateCountDown(body)
  })
  const mutationUpdateMess = useMutation((body: any) => {
    return updateCFMess(body)
  })
  const mutationUpdateGioiHan = useMutation((body: any) => {
    return updateGioiHan(body)
  })
  const mutationUpdateGioiHanThem = useMutation((body: any) => {
    return updateGioiHanThem(body)
  })
  const mutationUpdateStartPoint = useMutation((body: any) => {
    return updateStartPoint(body)
  })
  const handleUpdateTime = () => {
    const body = {
      time: time,
      activate: `Thời gian đếm ngược đơn hàng ${time} (phút)`,
      nameUser: ''
    }
    mutationUpdateTime.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật thời gian thành công ')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }

  const handleUpdateTiso = () => {
    const body = {
      numberOder: tiso
    }
    mutationUpdateTiso.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật % phí giao dịch thành công!')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  const handleUpdateClient = (client: any) => {
    const body = {
      number: client
    }
    mutationUpdateProduct.mutate(body, {
      onSuccess: () => {
        setShow1(false)
        setClient(client)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }

  const handleUpdateCountDowm = () => {
    const body = {
      countdown: cowndown
    }
    mutationUpdateCountDown.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật thời gian đếm ngược thành công!')
        setShow2(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  const handleUpdateMess = () => {
    const body = {
      content: message,
      activate: `Cấu hình tin nhắn      `,
      nameUser: ''
    }
    mutationUpdateMess.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật nội dung thông báo tin nhắn thành công!')
        setShowMess(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  const handleUpdateGioiHan = () => {
    const body = {
      number: gioihan,
      activate: `cấu hình Số tiền rút tối thiểu  ${gioihan}($)`,
      nameUser: ''
    }
    mutationUpdateGioiHan.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật giới hạn tiền rút thành công!')
        setShow1(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  const handleUpdateGioiHanThem = () => {
    const body = {
      number: gioihanthem,
      activate: `cấu hình Số tiền nạp tối thiểu  ${newcomer}($)`,
      nameUser: ''
    }
    mutationUpdateGioiHanThem.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật giới hạn tiền nạp thành công!')
        setShow4(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  const handleUpdateStartPoint = () => {
    const body = {
      number: gioihan
    }
    mutationUpdateStartPoint.mutate(body, {
      onSuccess: () => {
        toast.success('Cập nhật giới hạn tiền rút thành công!')
        setShow3(false)
      },
      onError: () => {
        toast.warning('Lỗi, hãy thử lại!')
      }
    })
  }
  return (
    <div className='flex justify-center items-center'>
      {' '}
      <div className=' dark:text-white shadow-stone-500 pt-5 p-20 w-full rounded-3xl'>
        <div className='flex md:flex-row lg:flex-row mobile:flex-col  justify-between items-center w-3/4'>
          {' '}
          <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
            <form onSubmit={handleSubmit}>
              <h2 className='font-bold text-xl'> Cấu hình tỉ lệ hoa hồng</h2>
              <div className='flex my-5 '>
                <div className='grid grid-cols-1 mr-2'>
                  <p className='pb-5'> Cấp độ</p>
                  <Dropdown options={commission} onSelect={handleSelect} />
                </div>
                <div className='grid grid-cols-1 '>
                  <p>Tỉ lệ theo %</p>
                  <input
                    type='number'
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder='0'
                    className='border border-gray-300 w-20 rounded-md px-3'
                  />
                </div>
                <div>
                  <br />
                  {show && (
                    <button type='submit' className='bg-blue-500 mt-5 pt-2 text-white px-4 py-3  rounded-md ml-2'>
                      Xác nhận
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className='flex flex-col justify-center items-center my-3 mx-8'>
            <label htmlFor='time' className='font-semibold'>
              Phần trăm số tiền tối thiểu mỗi lần khách hàng order(%)
            </label>
            <div className='flex items-center gap-x-2 mt-2'>
              <input
                value={orderPercentage}
                onChange={(e) => {
                  setOrderPercentage(e.target.value)
                  setShow9(true)
                }}
                id='time'
                type='number'
                placeholder='0'
                className=' text-center w-[150px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
              />
              {show9 && (
                <button onClick={handleUpdateOrderPercentage} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='flex md:flex-row lg:flex-row mobile:flex-col  justify-between items-center w-3/4'>
          {' '}
          <div className='my-5'>
            <h3 className='text-xl font-semibold mb-4'>Người dùng mới</h3>
            <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
              <label htmlFor='time' className='font-semibold'>
                Tỉ lệ hoa hồng người mới (%)
              </label>
              <div className='flex items-center gap-x-2 mt-2 mb-4'>
                <input
                  value={newcomer}
                  onChange={(e) => {
                    setNewcomer(e.target.value)
                    setShow3(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='%'
                  className=' text-center w-[100px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show3 && (
                  <button onClick={handleUpdateNewComer} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                    Xác nhận
                  </button>
                )}
              </div>
              {/* show3 */}
              <label htmlFor='time' className='font-semibold'>
                Giới hạn để nhận hoa hồng với người mới
              </label>
              <div className='flex items-center gap-x-2 mt-2'>
                <input
                  value={newcomerCommission}
                  onChange={(e) => {
                    setNewcomerCommissions(e.target.value)
                    setShow7(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='0'
                  className=' text-center w-[100px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show7 && (
                  <button
                    onClick={handleUpdateNewcomerCommission}
                    className='bg-blue-500 py-3 px-5 rounded-lg text-white'
                  >
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Hoa hồng giới thiệu và đơn hàng</h3>
            <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
              <label htmlFor='time' className='font-semibold'>
                Tỉ lệ % hoa hồng giới thiệu / 1 người (%)
              </label>
              <div className='flex items-center gap-x-2 mt-2 mb-4'>
                <input
                  value={orderCommission}
                  onChange={(e) => {
                    setOrderCommission(e.target.value)
                    setShow5(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='%'
                  className=' text-center w-[100px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show5 && (
                  <button onClick={handleUpdateOrderCommission} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                    Xác nhận
                  </button>
                )}
              </div>
              {/* show1 */}
              <label htmlFor='time' className='font-semibold'>
                Hoa hồng / đơn hàng (%)
              </label>

              <div className='flex items-center gap-x-2 mt-2'>
                <input
                  value={percent}
                  onChange={(e) => {
                    setpercent(e.target.value)
                    setShow6(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='%'
                  className=' text-center w-[100px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show6 && (
                  <button
                    onClick={handleUpdateReferralPercentage}
                    className='bg-blue-500 py-3 px-5 rounded-lg text-white'
                  >
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* show2 */}
        <div className='flex justify-between items-center w-3/4 mobile:flex-col'>
          {' '}
          <div className='col-span-4 tablet:col-span-2 mobile:col-span-4 mt-5'>
            <label htmlFor='time' className='dark:text-white font-bold text-xl'>
              Thời gian đếm ngược đơn hàng (phút)
            </label>
            <div className='flex items-center gap-x-2 mt-2'>
              {/* <input
                value={time}
                id='time'
                type='number'
                placeholder='phút'
                className='  text-center dark:bg-gray-600 w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
              />{' '} */}
              <input
                onChange={(e) => {
                  setTime(e.target.value)
                  setShow2(true)
                }}
                id='time'
                value={time}
                type='number'
                placeholder='phút'
                className=' text-center dark:bg-gray-600 w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
              />
              {show2 && (
                <button onClick={handleUpdateTime} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                  Xác nhận
                </button>
              )}
            </div>
          </div>
          <div className='col-span-4 tablet:col-span-2 mobile:col-span-4 mt-10'>
            <label htmlFor='message' className='dark:text-white font-bold text-xl mt-10'>
              Cấu hình tin nhắn
            </label>
            <div className='flex items-center gap-x-2 mt-2'>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setShowMess(true)
                }}
                id='message'
                placeholder='Nội dung...'
                className=' dark:bg-gray-600 h-[100px] w-[300px] border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
              />
              {showMess && (
                <button onClick={handleUpdateMess} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>

        {/* show1 */}
        <div>
          {' '}
          <h2 className='font-bold text-xl mt-10 mb-5'> Cài đặt nạp rút</h2>
          <div className=' flex mobile:flex-col  items-center w-3/4'>
            {' '}
            <div className='col-span-4 tablet:col-span-2 mobile:col-span-4 my-3 mx-8'>
              <label htmlFor='time' className='font-semibold'>
                Số tiền rút tối thiểu ($)
              </label>
              <div className='flex items-center gap-x-2 mt-2'>
                <input
                  value={gioihan}
                  onChange={(e) => {
                    setGioihan(e.target.value)
                    setShow1(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='đ'
                  className=' text-center w-[150px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show1 && (
                  <button onClick={handleUpdateGioiHan} className='bg-blue-500 py-1 px-5 rounded-lg text-white'>
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
            {/* show4 */}
            <div className='col-span-4 tablet:col-span-2 mobile:col-span-4 my-3 mx-8'>
              <label htmlFor='time' className='font-semibold'>
                Số tiền nạp tối thiểu ($)
              </label>
              <div className='flex items-center gap-x-2 mt-2'>
                <input
                  value={gioihanthem}
                  onChange={(e) => {
                    setGioihanThem(e.target.value)
                    setShow4(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='$'
                  className=' text-center w-[150px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show4 && (
                  <button onClick={handleUpdateGioiHanThem} className='bg-blue-500 py-1 px-5 rounded-lg text-white'>
                    Xác nhận
                  </button>
                )}
              </div>
            </div>{' '}
            <div className='flex flex-col justify-center items-center my-3 mx-8'>
              <label htmlFor='time' className='font-semibold'>
                Số lượng đơn hàng được order trong 1 ngày
              </label>
              <div className='flex items-center gap-x-2 mt-2'>
                <input
                  value={numberOrder}
                  onChange={(e) => {
                    setNumberOrder(e.target.value)
                    setShow8(true)
                  }}
                  id='time'
                  type='number'
                  placeholder='0'
                  className=' text-center w-[150px] dark:bg-gray-600 border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent'
                />
                {show8 && (
                  <button onClick={handleUpdateNumberOrder} className='bg-blue-500 py-3 px-5 rounded-lg text-white'>
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* showmess */}

        {/* <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
        <label htmlFor='radom'>Tỉ lệ random cấp hạn mức</label>
        <div className='flex items-center gap-x-2 mt-2'>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none   ${faction === '0' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateFaction('0')}
          >
            {' '}
            Random
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none ${faction === '1' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              } `}
            onClick={() => handleUpdateFaction('1')}
          >
            {' '}
            Chẳn
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none ${faction === '2' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateFaction('2')}
          >
            {' '}
            Lẻ
          </button>
        </div>
      </div>
      <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
        <label htmlFor='radom'>Tỉ lệ random hạng mức</label>
        <div className='flex items-center gap-x-2 mt-2 '>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none  ${product === '0' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateProduct('0')}
          >
            {' '}
            Random
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none   ${product === '1' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateProduct('1')}
          >
            {' '}
            chẳn{' '}
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center w-[100px] dark:text-white border border-slate-200 rounded-lg py-3 px-5 outline-none   ${product === '2' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateProduct('2')}
          >
            {' '}
            Lẻ
          </button>
        </div>
      </div>
      <div className='col-span-4 tablet:col-span-2 mobile:col-span-4'>
        <label htmlFor='radom'>Tỉ lệ random  nâng cấp hạng mức</label>
        <div className='flex items-center gap-x-2 mt-2 '>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none  ${client === '0' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateClient('0')}
          >
            {' '}
            Random
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center dark:text-white w-[100px] border border-slate-200 rounded-lg py-3 px-5 outline-none   ${client === '1' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateClient('1')}
          >
            {' '}
            chẳn{' '}
          </button>
          <button
            id='radom'
            placeholder='%'
            className={`text-center w-[100px] dark:text-white border border-slate-200 rounded-lg py-3 px-5 outline-none   ${client === '2' ? 'bg-green-800 text-gray-50' : 'bg-transparent text-slate-950'
              }`}
            onClick={() => handleUpdateClient('2')}
          >
            {' '}
            Lẻ
          </button>
        </div>
      </div> */}
      </div>
    </div>
  )
}

export default Settings
