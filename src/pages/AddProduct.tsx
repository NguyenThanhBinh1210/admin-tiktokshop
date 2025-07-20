/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { deleteStaff, updateStaff } from '~/apis/product.api';
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
import { getAllUserSearch } from '~/apis/product.Distribute.api';
import GetProductByUser from '~/components/Modal/GetProductByUser';
import { formatCurrency } from '~/utils/utils';

const AddProduct = () => {
  const { profile } = useContext(AppContext);
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
    () => getAllUserSearch(search, currentPage,),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        console.log(data);
        setStaff(data.data.users);
        setTotalPages(data.data.totalPages);
      },
    }
  );

  const updateMutation = useMutation((body: any) => {
    const data = {
      isLook: body.isLook,
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
        queryClient.invalidateQueries(['user']);
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
        queryClient.invalidateQueries(['user']);
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
          queryClient.invalidateQueries(['user']);
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200"
                  >
                    Tải lại dữ liệu
                  </button>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="pl-6 py-3">STT</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">Username</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">idUser</th>
                        <th scope="col" className="px-3 py-3 min-w-[140px]">Số tiền trong ví</th>

                        <th scope="col" className="px-3 py-3 min-w-[140px]">Sản phẩm còn hoạt động</th>
                        <th scope="col" className="px-6 py-3">Tổng số lượng hàng</th>
                        <th scope="col" className="px-6 py-3 text-center">Xem chi tiết</th>

                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((item: any, idx: number) => (
                        <tr
                          key={item._id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="pl-6 py-3">{(currentPage - 1) * limit + idx + 1}</td>
                          <td className="px-3 py-3">{item.username}</td>
                          <td className="px-3 py-3">{item.idUser}</td>
                          <td className="px-3 py-3">{formatCurrency(item.totalAmount)}</td>

                          <td className="px-6 py-3">{item.productStillWorks}</td>
                          <td className="px-6 py-3 text-green-500">{item.productAll}</td>


                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setOpenProfile(item)}
                                className="bg-green-400 hover:bg-green-500 text-white rounded-md px-3 py-1 text-sm whitespace-nowrap transition-all duration-200"
                              >
                                Thông tin
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
      {isOpenProfile &&
        <GetProductByUser isOpen={isOpenProfile} onClose={() =>{setOpenProfile(false) ,queryClient.invalidateQueries(['user'])} 
        } data={isOpenProfile} />}

    </>
  );
};

export default AddProduct;
