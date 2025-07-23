import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { checkFacebookCustomer, addFacebookCustomer, getAllFacebookCustomers, getMyFacebookCustomers } from '~/apis/employee.api';
import { AppContext } from '~/contexts/app.context';
import { User } from '~/types/user.type';
import { getAllStaff } from '~/apis/product.api';
import { getAllAdmin } from '~/apis/product.api';
import Loading from '~/components/Loading/Loading';
import Paginate from '~/components/Pagination/Paginate';

const FacebookCustomerPage = () => {
  const { profile } = useContext(AppContext);
  const isAdmin = profile?.role === 'admin' || profile?.isAdmin;
  const [facebookAccount, setFacebookAccount] = useState('');
  const [username, setUserId] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [search, setSearch] = useState({ facebookAccount: '', staffUsername: '', userUsername: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any>({ data: [], page: 1, limit: 10, total: 0, totalPages: 1 });
  const queryClient = useQueryClient();

  // Lấy danh sách facebook customer cho admin
  useEffect(() => {
    if (isAdmin) {
      getAllFacebookCustomers({
        page,
        limit,
        ...search,
      }).then((res: any) => {
        setData(res.data);
      }).catch(err => {
        console.error('Error loading facebook customers:', err);
      });
    }
  }, [isAdmin, page, limit, search]);

  // Staff: check facebook account
  const checkMutation = useMutation((account: string) => checkFacebookCustomer(account), {
    onSuccess: (res) => {
      setCheckResult(res.data);
    },
    onError: () => {
      toast.error('Lỗi kiểm tra tài khoản Facebook!');
    },
  });

  // Staff: add facebook customer
  const addMutation = useMutation((body: { facebookAccount: string; username: string }) => addFacebookCustomer(body), {
    onSuccess: () => {
      toast.success('Lưu thành công!');
      setFacebookAccount('');
      setUserId('');
      setCheckResult(null);
      queryClient.invalidateQueries(['facebook-customer', profile?._id]);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi lưu tài khoản Facebook!');
    },
  });

  // Staff: Lấy danh sách facebook customer của chính mình
  const [myList, setMyList] = useState<any>({ data: [], page: 1, limit: 10, total: 0, totalPages: 1 });
  const [myPage, setMyPage] = useState(1);
  const [myLimit] = useState(10);
  useEffect(() => {
    if (!isAdmin) {
      getMyFacebookCustomers({ page: myPage, limit: myLimit }).then((res: any) => {
        setMyList(res.data);
      }).catch(err => {
        console.error('Error loading my facebook customers:', err);
      });
    }
  }, [isAdmin, myPage, myLimit, addMutation.isSuccess]);

  const handleSearch = () => {
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // UI cho staff
  const renderStaffForm = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Facebook KH</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Form lưu tài khoản Facebook */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Lưu tài khoản Facebook khách hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tài khoản Facebook (link hoặc username):
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập link Facebook hoặc username"
                value={facebookAccount}
                onChange={e => {
                  setFacebookAccount(e.target.value);
                  setCheckResult(null); // Reset check result khi thay đổi input
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn khách hàng:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập username khách hàng"
                value={username}
                onChange={e => setUserId(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => checkMutation.mutate(facebookAccount)}
              disabled={!facebookAccount.trim() || checkMutation.isLoading}
            >
              {checkMutation.isLoading ? 'Đang kiểm tra...' : 'Kiểm tra trùng'}
            </button>
            
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => addMutation.mutate({ facebookAccount, username })}
              disabled={!facebookAccount.trim() || !username.trim() || !checkResult || checkResult.existed || addMutation.isLoading}
            >
              {addMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>

          {/* Debug information - Remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
              <div><strong>Debug Info:</strong></div>
              <div>Facebook Account: {facebookAccount || 'Empty'}</div>
              <div>User ID: {username || 'Empty'}</div>
              <div>Check Result: {checkResult ? (checkResult.existed ? 'Existed' : 'Available') : 'Not checked'}</div>
              <div>Can Save: {(!facebookAccount.trim() || !username.trim() || !checkResult || checkResult.existed) ? 'No' : 'Yes'}</div>
            </div>
          )}

          {/* Check result */}
          {checkResult && (
            <div className="mt-4 p-3 rounded-md">
              {checkResult.existed ? (
                <div className="flex items-center text-red-700 bg-red-50 p-3 rounded-md">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Tài khoản đã tồn tại!
                </div>
              ) : (
                <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-md">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Có thể lưu mới.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danh sách Facebook khách hàng của staff */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách Facebook khách hàng của bạn</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facebook Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Facebook</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myList?.data && myList.data.length > 0 ? (
                  myList.data.map((item: any, idx: number) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(myPage - 1) * myLimit + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.facebookAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.username?.name || 'N/A'} ({item.username?.username || 'dev005'})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a 
                          href={item.facebookUrl || `https://www.facebook.com/${item.facebookAccount}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-blue-800 underline"
                        >
                          {item.facebookUrl || `https://www.facebook.com/${item.facebookAccount}`}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {myList?.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Paginate
                currentPage={myPage}
                totalPages={myList.totalPages}
                handlePageChange={setMyPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // UI cho admin
  const renderAdminTable = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Danh sách tài khoản Facebook khách hàng</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm Facebook Account
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm Facebook Account"
                value={search.facebookAccount}
                onChange={e => setSearch(s => ({ ...s, facebookAccount: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm username nhân viên
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm username nhân viên"
                value={search.staffUsername}
                onChange={e => setSearch(s => ({ ...s, staffUsername: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm username khách hàng
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm username khách hàng"
                value={search.userUsername}
                onChange={e => setSearch(s => ({ ...s, userUsername: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facebook Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Facebook</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data && data.data.length > 0 ? (
                  data.data.map((item: any, idx: number) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.facebookAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.staffId?.name || 'N/A'} ({item.staffId?.username || 'N/A'})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.username?.name || 'N/A'} ({item.username?.username || 'N/A'})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a 
                          href={item.facebookUrl || `https://www.facebook.com/${item.facebookAccount}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-blue-800 underline"
                        >
                          Xem Facebook
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {data?.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Paginate
                currentPage={page}
                totalPages={data.totalPages}
                handlePageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isAdmin ? renderAdminTable() : renderStaffForm()}
    </>
  );
};

export default FacebookCustomerPage;