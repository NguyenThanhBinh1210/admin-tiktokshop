import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getCustomerByEmployee } from '~/apis/employee.api';
import { getAccessTokenFromLS } from '~/utils/auth';


const GetCustomerByStaff = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const accessToken = getAccessTokenFromLS()

  const { data: employeeData } = useQuery({
    queryKey: ['customer', data.username, currentPage],
    queryFn: () => getCustomerByEmployee(data._id, currentPage),
    cacheTime: 60000,
  });
  console.log(employeeData?.data.users);
  const createCustomerMutation = useMutation({
    mutationFn: async () => {

      const response = await axios.post('https://admin.ordersdropship.com/api/v1/employee/add-customer', {
        customerId: newCustomerId,
        employeeId: data._id,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Khách hàng đã được thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['customer', data.username, currentPage] });
      setNewCustomerId(''); // Reset form
      setNewQuantity(1); // Reset quantity
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tạo Khách hàng: ${error.response?.data?.message || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axios.post('https://admin.ordersdropship.com/api/v1/employee/delete', { customerId: id, employeeId: data._id }, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Khách hàng đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['customer', data.username, currentPage] });
      setConfirmDelete(false);
    },
    onError: () => {
      toast.warn('Lỗi khi xóa Khách hàng!');
      setConfirmDelete(false);
    },
  });
  const blockMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axios.post('https://admin.ordersdropship.com/api/v1/employee/delete', { idCustomer: id }, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Khách hàng đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['customer', data.username, currentPage] });
      setConfirmDelete(false);
    },
    onError: () => {
      toast.warn('Lỗi khi xóa Khách hàng!');
      setConfirmDelete(false);
    },
  });
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomerIdToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteCustomer = () => {
    if (customerIdToDelete) {
      deleteMutation.mutate({ id: customerIdToDelete });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setCustomerIdToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerId || newQuantity <= 0) {
      toast.warn('Vui lòng nhập đầy đủ thông tin Khách hàng.');
      return;
    }
    createCustomerMutation.mutate();
  };

  // Pagination Logic
  const totalPages = employeeData?.data.totalPages || 1;

  const truncateTitle = (title: string) => {
    const maxLength = 50;
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      onClick={handleModalClick}
      className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} fixed bg-[#02020246] dark:bg-[#ffffff46] top-0 left-0 right-0 z-50 w-[100vw] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] transition-all`}
    >
      <div
        ref={modalRef}
        className="relative z-100 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] max-w-7xl tablet:max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Xem khách hàng</h3>

            {/* Store Information */}
            {data && (
              <div className="mb-4 flex gap-4">
                <p className="text-lg font-semibold">Tên nhân viên: {data.username}</p>
              </div>
            )}

            {/* Form tạo Khách hàng mới */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                    Id khách hàng
                  </label>
                  <input
                    type="text"
                    id="customerId"
                    value={newCustomerId}
                    onChange={(e) => setNewCustomerId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập mã Khách hàng"
                    required
                  />
                </div>

              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Thêm khách hàng
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Hủy
                </button>
              </div>
            </form>

            {/* users Table */}
            {employeeData?.data.users && employeeData.data.users.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeData.data.users.map((customer: any) => (
                    <tr key={customer.customerId} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">{customer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type='button'
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-2 py-1'
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Chưa thêm khách hàng nào.</p>
            )}

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Trước
              </button>
              <span>Trang {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hộp thoại xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="mb-4 text-lg font-semibold">Bạn có chắc chắn muốn xóa Khách hàng này?</h4>
            <div className="flex justify-between">
              <button
                onClick={confirmDeleteCustomer}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetCustomerByStaff;
