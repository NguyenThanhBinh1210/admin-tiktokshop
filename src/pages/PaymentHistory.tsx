import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getRecharges } from '~/apis/admin.api';
import { deleteHistory } from '~/apis/payment.api'
import Paginate from '~/components/Pagination/Paginate';
import Loading from '~/components/Loading/Loading';
import { toast } from 'react-toastify';
import { FormatNumber } from '~/hooks/useFormatNumber';
import { formatTime } from '~/utils/utils';
import AddHistory from '~/components/Modal/AddHistory';
import AddWalletHistory from '~/components/Modal/AddWalletHistory';

const PaymentHistory = () => {
  const queryClient = useQueryClient();
  const [type, setType] = useState<'recharge' | 'withdraw'>('recharge');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenFreeze, setOpenFreeze] = useState(false);
  const [userId, setUserId] = useState<any>('');

  const itemsPerPage = 8;

  // Fetch data using useQuery
  const { data, isLoading } = useQuery(
    ['paymentHistory', currentPage, type, search],
    () => getRecharges(search, currentPage, type),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    queryClient.invalidateQueries(['paymentHistory']);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= data?.data?.totalPages) {
      setCurrentPage(page);
      queryClient.invalidateQueries(['paymentHistory']);
    }
  };

  const handleDelete = async (id: string, status: string, customer: string) => {
    try {
      await deleteHistory(id, status, customer);
      toast.success('Xoá thành công!');
      queryClient.invalidateQueries(['paymentHistory']); // Refresh the data without reloading the page
    } catch (error) {
      toast.error('Xoá thất bại!');
    }
  };

  return (
    <>
      <div className="flex justify-between mb-3 mobile:flex-col tablet:flex-col">
        <div className="w-[50%] mobile:w-full">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm theo mã giao dịch hoặc username"
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex gap-x-3">
          <button
            onClick={() => {
              setType('recharge');
              setCurrentPage(1);
              queryClient.invalidateQueries(['paymentHistory']);
            }}
            className={`w-[120px] h-[40px] rounded-lg flex items-center justify-center ${type === 'recharge' ? 'bg-blue-600 text-white' : 'ring-1 ring-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
          >
            Nạp tiền
          </button>
          <button
            onClick={() => {
              setType('withdraw');
              setCurrentPage(1);
              queryClient.invalidateQueries(['paymentHistory']);
            }}
            className={`w-[120px] h-[40px] rounded-lg flex items-center justify-center ${type === 'withdraw' ? 'bg-blue-600 text-white' : 'ring-1 ring-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
          >
            Rút tiền
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center items-center h-full gap-x-3">
          <Loading />
        </div>
      ) : (
        <>
          <div className="relative h-[460px] flex-1 overflow-x-auto rounded-md shadow-md">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">STT</th>
                  <th className="px-6 py-3">Mã giao dịch</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Họ tên</th>
                  <th className="px-6 py-3">Số tiền</th>
                  <th className="px-6 py-3">Ngân hàng</th>
                  <th className="px-6 py-3">STK</th>

                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Lý do</th>
                  <th className="px-6 py-3 text-center">Thời gian xin</th>

                  <th className="px-6 py-3 text-center">Thời gian duyệt</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.data?.map((item: any, idx: number) => (
                  <tr key={item._id} className="bg-white border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-4">{item.codeOder}</td>
                    <td className="px-6 py-4">{item.userId?.username}</td>
                    <td className="px-6 py-4">{item.userId?.name}</td>

                    <td className="px-6 py-4">{FormatNumber(item.totalAmount)}</td>
                    <td className="px-6 py-4">{item.bankName}</td>

                    <td className="px-6 py-4">{item.bankNumber}</td>

                    <td className="px- py-4">
                      {item.status === 'pending' ? (
                        <span className="bg-yellow-500 text-white px-2 py-0.5 text-xs rounded-md">Đang chờ</span>
                      ) : item.status === 'done' ? (
                        <span className="bg-green-500 text-white  py-0.5 text-xs rounded-md">Thành công</span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-md">Đã huỷ</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{item.info}</td>
                    <td className="px-6 py-4">{formatTime(item.createdAt)}</td>
                    <td className="px-6 py-4">{formatTime(item.updatedAt)}</td>


                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        {item.status === 'pending' && (
                          <button
                            onClick={() => {
                              setUserId(item);
                              setOpenFreeze(true);
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 focus:outline-none transition-all"
                          >
                            Tác động
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id, item.status, item.userId?.username)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 focus:outline-none transition-all"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginate
            totalPages={data?.data?.totalPages || 1}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
          {type === 'recharge' && isOpenFreeze === true && (
            <AddHistory
              stastes="add"
              userId={userId}
              isOpen={isOpenFreeze}
              onClose={() => {
                setOpenFreeze(false);
                queryClient.invalidateQueries(['paymentHistory']);
              }}
            />
          )}
          {type === 'withdraw' && isOpenFreeze === true && (
            <AddWalletHistory
              stastes="minus"
              userId={userId}
              isOpen={isOpenFreeze}
              onClose={() => {
                setOpenFreeze(false);
                queryClient.invalidateQueries(['paymentHistory']);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default PaymentHistory;
