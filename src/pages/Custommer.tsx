/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { deleteStaff, getAllStaff, updateStaff } from '~/apis/product.api';
import Loading from '~/components/Loading/Loading';
import Modal from '~/components/Modal';
import CreateRecharge from '~/components/Modal/CreateRecharge';
import TruRecharge from '~/components/Modal/TruRecharge';
import NotReSearch from '~/components/NotReSearch/NotReSearch';
import Paginate from '~/components/Pagination/Paginate';
import { AppContext } from '~/contexts/app.context';
import CreateCustommer from '~/components/Modal/CreateCustommer';
import SearchHeader from '~/components/Search/Search';
import AddMoney from '~/components/Modal/AddMoney';
import MinusMoney from '~/components/Modal/MinusMoney';
import AddFreeze from '~/components/Modal/AddFreeze';
import MinusFreeze from '~/components/Modal/MinusFreeze';
import ViewProfile from '~/components/Modal/ViewProfile';
import ViewOrderDay from '~/components/Modal/ViewOrderDay';
import { io } from 'socket.io-client';
import { formatCurrency } from '~/utils/utils';

const Custommer = () => {
  const { profile } = useContext(AppContext);
  const serverUrl = 'https://socket.ordersdropship.com'

  const initialFromState = {
    name: '',
    username: '',
    password: '',
    bankName: '',
    banKNumber: '',
    nameUserBank: '',
  };
  const [staff, setStaff] = useState<any[]>([]);
  const [userId, setUserId] = useState<any>('');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const [isOpenProfile, setOpenProfile] = useState<any>(null);
  const [isOrderDay, setOrderDay] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isOpenRecharge, setOpenRecharge] = useState(false);
  const [isOpenRecharges, setOpenRecharges] = useState(false);
  const [isOpenMoney, setOpenMoney] = useState(false);
  const [isOpenMoneys, setOpenMoneys] = useState(false);
  const [isOpenFreeze, setOpenFreeze] = useState(false);
  const [isOpenFreezes, setOpenFreezes] = useState(false);
  const [showUser, setShowComment] = useState<any>(null);
  const [staffModal, setStaffModal] = useState(initialFromState);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingUser, refetch } = useQuery(
    ['user', currentPage, search],
    () => getAllStaff(search, currentPage, limit),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setStaff(data.data.users);
        setTotalPages(data.data.totalPages);
      },
    }
  );

  const updateMutation = useMutation((body: any) => {
    const data = {
      isLook: body.isLook,
      isIdRef: body.isIdRef,

      isDongBang: body.isDongBang,
      level: body.level,
      nameUser: body.nameUser,
      activate: body.activate,
    };
    return updateStaff(body?._id, data);
  });

  const deleteMutation = useMutation((data: { id: string; status: string; customer: string }) =>
    deleteStaff(data.id, data.status, data.customer)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleReset = () => {
    setSearch('');
    setCurrentPage(1);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleUpdateLook = (item: any, activate: string) => {
    const newData = {
      _id: item._id,
      isLook: item.isLook ? false : true,
      nameUser: item.username,
      activate: activate,
    };
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search]);
        toast.success('Thành công!');
      },
    });
  };
  const handleUpdateIsIdRef = (item: any, activate: string) => {
    console.log("item.isIdRef", item.isIdRef);
    const newData = {
      _id: item._id,
      isIdRef: item.isIdRef ? false : true,

      nameUser: item.username,
      activate: activate,
    };
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search]);
        toast.success('Thành công!');
      },
    });
  };
  const handleUpdateIsDongBang = (item: any, activate: string) => {
    console.log("item.isIdRef", item.isIdRef);
    const newData = {
      _id: item._id,
      isDongBang: item.isDongBang ? false : true,

      nameUser: item.username,
      activate: activate,
    };
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search]);
        toast.success('Thành công!');
      },
    });
  };
  const handleUpdateLevel = (item: any, value?: string, activate?: string) => {
    const newData = {
      _id: item._id,
      level: value,
      nameUser: item.username,
      activate: activate,
    };
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', currentPage, search]);
        toast.success('Thành công!');
      },
    });
  };

  const handleDeleteStaff = (id: string, status: string, customer: string) => {
    deleteMutation.mutate(
      { id, status, customer },
      {
        onSuccess: () => {
          toast.success('Đã xoá!');
          queryClient.invalidateQueries(['user', currentPage, search]);
        },
        onError: () => {
          toast.warn('Lỗi!');
        },
      }
    );
  };
  const refetchData = () => {
    refetch();
    toast.info('Dữ liệu đã được làm mới!');
  };
  const logoutAll = () => {
    const socket = io(serverUrl);
    socket.emit('resetByAdmin');
    toast.success(`Bạn đã đăng xuất tất cả user đang onl!`);
  };
  const logoutUser = (e: any) => {
    const socket = io(serverUrl);
    socket.emit('resetByUser', e);
    toast.success(`Bạn đã đăng xuất ${e.username}!`);
  };
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
                <div className="relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg">
                  <button
                    onClick={refetchData}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 mx-5"
                  >
                    Tải lại dữ liệu
                  </button>
                  <button
                    onClick={logoutAll}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200"
                  >
                    Đăng xuất tất cả
                  </button>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="pl-6 py-3">STT</th>
                        <th scope="col" className="pl-6 py-3">id</th>

                        <th scope="col" className="px-3 py-3 min-w-[140px]">Username</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">Họ tên</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">Mã giới thiệu</th>
                        <th scope="col" className="px-6 py-3 min-w-[170px]">Người giới thiệu</th>
                        <th scope="col" className="px-6 py-3">Số tiền</th>
                        <th scope="col" className="px-6 py-3 min-w-[180px]">Số tiền đóng băng</th>
                        <th scope="col" className="px-6 py-3 min-w-[150px]">Hoa hồng</th>
                        <th scope="col" className="px-2 py-3 min-w-[100px]">Level</th>
                        <th scope="col" className="px-2 py-3 min-w-[100px]">Khoá tài khoản</th>

                        <th scope="col" className="px-2 py-3 min-w-[100px]">Khoá mã mời</th>
                        <th scope="col" className="px-2 py-3 min-w-[100px]">Đóng băng tài khoản</th>

                        <th scope="col" className="px-3 py-3 min-w-[130px]">Đăng xuất tài khoản</th>
                        <th scope="col" className="px-6 py-3 text-center">Hành động</th>
                        <th scope="col" className="px-6 py-3 text-center">Cài đặt order theo ngày</th>
                        <th scope="col" className="px-6 py-3 text-center min-w-[130px]">Ngân hàng</th>
                        {/* <th scope="col" className="px-6 py-3 text-center min-w-[130px]">Đóng băng tiền</th> */}

                        <th scope="col" className="px-6 py-3 text-center">Nạp tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((item: any, idx: number) => (
                        <tr
                          key={item._id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="pl-6 py-3">{(currentPage - 1) * limit + idx + 1}</td>
                          <td className="px-3 py-3">{item._id}</td>

                          <td className="px-3 py-3">{item.username}</td>
                          <td className="px-3 py-3">{item.name}</td>

                          <td className="px-3 py-3">{item.idUser}</td>
                          <td className="px-6 py-3">{item.idRef}</td>
                          <td className="px-6 py-3 text-green-500">{formatCurrency(item.totalAmount)}</td>
                          <td className="px-6 py-3 text-green-500">{formatCurrency(item.totalFreeze)}</td>
                          <td className="px-6 py-3 text-green-500">{formatCurrency(item.moneyComissions)}</td>
                          <td className="px-2 py-3">
                            <select
                              className={`w-[130px] p-2 font-medium rounded-md ${item.level ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-700'
                                }`}
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
                          <td
                            scope="row"
                            className="px-3 py-3 gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item.isLook}
                                  onChange={() =>
                                    handleUpdateLook(
                                      item,
                                      `đã ${item.isLook ? 'mở' : 'chặn'} tài khoản ${item?.username}`
                                    )
                                  }
                                />

                                <div
                                  className={`
          w-11 h-6 bg-gray-200 
          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
          rounded-full peer
          transition-colors
          peer-checked:bg-green-500
        `}
                                ></div>


                                <div
                                  className={`
          absolute
          w-4 h-4  p-3
          bg-white border border-gray-300 rounded-full
          transition-all
          peer-checked:translate-x-5
        `}
                                ></div>
                              </label>
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {item.isLook ? 'mở' : 'chặn'}
                              </span>
                            </div>
                          </td>
                          <td
                            scope="row"
                            className="px-3 py-3 gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item.isIdRef}
                                  onChange={() =>
                                    handleUpdateIsIdRef(
                                      item,
                                      `đã ${item.isIdRef ? 'mở' : 'chặn'} mã mời tài khoản ${item?.username}`
                                    )
                                  }
                                />

                                <div
                                  className={`
          w-11 h-6 bg-gray-200 
          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
          rounded-full peer
          transition-colors
          peer-checked:bg-green-500
        `}
                                ></div>


                                <div
                                  className={`
          absolute
          w-4 h-4  p-3
          bg-white border border-gray-300 rounded-full
          transition-all
          peer-checked:translate-x-5
        `}
                                ></div>
                              </label>
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {item.isIdRef ? 'mở ' : 'khoá'}
                              </span>
                            </div>
                          </td>
                          <td
                            scope="row"
                            className="px-3 py-3 gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item.isDongBang}
                                  onChange={() =>
                                    handleUpdateIsDongBang(
                                      item,
                                      `đã ${item.isDongBang ? 'mở đóng băng' : 'đóng băng'} tài khoản ${item?.username}`
                                    )
                                  }
                                />

                                <div
                                  className={`
          w-11 h-6 bg-gray-200 
          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
          rounded-full peer
          transition-colors
          peer-checked:bg-green-500
        `}
                                ></div>


                                <div
                                  className={`
          absolute
          w-4 h-4  p-3
          bg-white border border-gray-300 rounded-full
          transition-all
          peer-checked:translate-x-5
        `}
                                ></div>
                              </label>
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {item.isDongBang ? 'mở ' : 'khoá'}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-3">
                            <button
                              className={`w-32 h-10 font-medium text-white rounded-full transition-all duration-300  bg-red-500 hover:bg-red-600`}
                              onClick={() => logoutUser(item)}
                            >
                              Đăng xuất
                            </button>
                          </td>

                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setOpenProfile(item)}
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
                          </td>

                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => setOrderDay(item)}
                              className="bg-green-400 hover:bg-green-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                            >
                              Thiết lập
                            </button>
                          </td>

                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setModalOpen(true);
                                setShowComment(item);
                              }}
                              className="bg-blue-400 hover:bg-blue-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                            >
                              Tác động
                            </button>
                          </td>

                          {/* <td className="px-6 py-3">
                            <button
                              type="button"
                              title="Đóng băng tiền"
                              onClick={() => {
                                setOpenFreeze(true);
                                setUserId(item);
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-2 py-1 text-center"
                            >
                              Tác động
                            </button>
                          </td> */}
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMoney(true);
                                  setUserId(item);
                                }}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                              >
                                Nạp
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMoneys(true);
                                  setUserId(item);
                                }}
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
                <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
              </>
            )}
          </>
        )}
      </div>

      {/* Các modal và component khác */}
      {isOpenRecharge &&
        <CreateRecharge
          userId={userId}
          isOpen={isOpenRecharge}
          onClose={() => {
            setOpenRecharge(false);
            setUserId('');
            queryClient.invalidateQueries(['user', currentPage, search]);

          }}
        />}
      {isOpenRecharges && <TruRecharge
        userId={userId}
        isOpen={isOpenRecharges}
        onClose={() => {
          setOpenRecharges(false);
          setUserId('');
          queryClient.invalidateQueries(['user', currentPage, search]);

        }}
      />}
      {isOpenMoney && <AddMoney
        userId={userId}
        isOpen={isOpenMoney}
        onClose={() => {
          setOpenMoney(false);
          setUserId('');
          queryClient.invalidateQueries(['user', currentPage, search]);

        }}
      />}
      {isOpenMoneys && <MinusMoney
        userId={userId}
        isOpen={isOpenMoneys}
        onClose={() => {
          setOpenMoneys(false);
          setUserId('');
          queryClient.invalidateQueries(['user', currentPage, search]);

        }}
      />}
      {isOpenFreeze && <AddFreeze
        userId={userId}
        isOpen={isOpenFreeze}
        onClose={() => {
          setOpenFreeze(false);
          setUserId({});
          queryClient.invalidateQueries(['user', currentPage, search]);

        }}
      />}
      {isOpenFreezes && <MinusFreeze
        userId={userId}
        isOpen={isOpenFreezes}
        onClose={() => {
          setOpenFreezes(false);
          setUserId({});
          queryClient.invalidateQueries(['user', currentPage, search]);

        }}
      />}
      {isOpenProfile &&
        <ViewProfile
          data={isOpenProfile}
          isOpen={isOpenProfile}
          onClose={() => {
            setOpenProfile(null);
            queryClient.invalidateQueries(['user', currentPage, search]);

          }}
        />}
      {isOrderDay &&
        <ViewOrderDay
          data={isOrderDay}
          isOpen={isOrderDay}
          onClose={() => {
            setOrderDay(null);
            queryClient.invalidateQueries(['user', currentPage, search]);

          }}
        />}
      {isModalOpen &&
        <Modal
          data={showUser}
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false);
            setShowComment(initialFromState);
            queryClient.invalidateQueries(['user', currentPage, search]);

          }}
        />}
      {isModalOpenCreate &&
        <CreateCustommer
          data={staffModal}
          isOpen={isModalOpenCreate}
          onClose={() => {
            setModalOpenCreate(false);
            setStaffModal(initialFromState);
            queryClient.invalidateQueries(['user', currentPage, search]);

          }}
        />}
    </>
  );
};

export default Custommer;
