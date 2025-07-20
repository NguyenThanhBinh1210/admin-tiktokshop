/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getAllOrderSpecial } from '~/apis/product.api';
import Loading from '~/components/Loading/Loading';
import Paginate from '~/components/Pagination/Paginate';
import { UpdateOrdertHistory } from '~/apis/payment.api';
import { formatCurrency, formatTime } from '~/utils/utils';
import { AppContext } from '~/contexts/app.context';

const OrderSpecial = () => {
  const { profile } = useContext(AppContext);

  // State for search and pagination
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryClient = useQueryClient();

  // Fetch orders based on currentPage and search
  const { data, isLoading, error } = useQuery(
    ['orders', currentPage, search],
    () => getAllOrderSpecial(search, currentPage).then((res) => res.data),
    {
      keepPreviousData: true,
      cacheTime: 60000,
    }
  );

  const totalPages = data?.totalPages || 1;
  const totalOrders = data?.totalOrders || 0;
  const orders = data?.orders || [];

  // Mutation for updating order status
  const updateMutations = useMutation({
    mutationFn: ({
      id,
      complete,
      luuVet,
      customer,
    }: {
      id: string;
      complete: string;
      luuVet: string;
      customer: string;
    }) => UpdateOrdertHistory(id, complete, luuVet, customer),
    onSuccess: () => {
      queryClient.invalidateQueries('orders');
    },
  });

  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle order update (status change)
  const handleUpdate = (id: string, complete: string, luuVet: string, customer: string) => {
    updateMutations.mutate({ id, complete, luuVet, customer });
  };

  return (
    <>
      <div className="flex justify-between mb-3 mobile:flex-col tablet:flex-col">
        <div className="mb-2 flex items-center">
          <span className="my-4 font-bold dark:text-white">Số lượng đơn hàng: {totalOrders}</span>
        </div>
        <div className="w-[50%] mobile:w-full">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Tìm kiếm theo Mã hàng hoặc username..."
              />
              <button
                type='submit'
                className='text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-[30px] flex-1">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div>Error</div>
        ) : (
          <>
            <div className="relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">STT</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-4 py-3">Tên sản phẩm</th>
                    <th className="px-4 py-3">Hình sản phẩm</th>

                    <th className="px-6 py-3">Mã giới thiệu</th>
                    <th className="px-6 py-3">Giá</th>
                    <th className="px-6 py-3">Hoa hồng</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Thời gian đặt</th>
                    <th className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length ? (
                    orders.map((order: any, idx: number) => (
                      <tr
                        key={order._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-3">{(currentPage - 1) * 10 + idx + 1}</td>
                        <td className="px-6 py-3">
                          {order?.userId?.username ?? 'Tài khoản bị khoá hoặc đã xoá'}
                        </td>
                        <td className="px-4 py-3">{order.name}</td>
                        <td className="px-6 py-3">
                          <img className="w-10 h-10 rounded-full" src={order.image} alt="product" />
                        </td>
                        <td className="px-6 py-3">{order?.userId?.idUser ?? 'Tài khoản bị khoá hoặc đã xoá'}</td>
                        <td className="px-6 py-3">{formatCurrency(order.money)}</td>
                        <td className="px-6 py-3">{formatCurrency(order.commission)}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`${order.complete === 'pending'
                              ? 'bg-yellow-500'
                              : order.complete === 'done'
                                ? 'bg-green-500'
                                : order.complete === 'deny'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              } text-white px-2 py-0.5 pb-1 text-xs rounded-md`}
                          >
                            {order.complete}
                          </span>
                        </td>
                        <td className="px-6 py-3">{formatTime(order.createdAt)}</td>
                        <td className="px-6 py-3 flex gap-2">
                          {order.complete === 'pending' && (
                            <button
                              onClick={() =>
                                handleUpdate(
                                  order._id,
                                  'done',
                                  `đã cập nhập thắng đơn order mã code ${order.code}`,
                                  `${order?.userId?.idUser ?? 'Tài khoản bị khoá hoặc đã xoá'}`
                                )
                              }
                              className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Thắng
                            </button>
                          )}

                          {order.complete === 'done' && (
                            <button
                              onClick={() =>
                                handleUpdate(
                                  order._id,
                                  'deny',
                                  `đã cập nhập đóng băng đơn order mã code ${order.code}`,
                                  `${order?.userId?.idUser ?? 'Tài khoản bị khoá hoặc đã xoá'}`
                                )
                              }
                              className="text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Đóng băng
                            </button>
                          )}

                          {profile?.isAdmin && (
                            <button
                              onClick={() =>
                                handleUpdate(
                                  order._id,
                                  'delete',
                                  `đã xoá đơn order mã code ${order.code}`,
                                  `${order?.userId?.idUser ?? 'Tài khoản bị khoá hoặc đã xoá'}`
                                )
                              }
                              className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Xoá
                            </button>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
    </>
  );
};

export default OrderSpecial;
