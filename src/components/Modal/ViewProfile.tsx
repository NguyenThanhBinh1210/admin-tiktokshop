/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import { formatCurrency } from '~/utils/utils'

const ViewProfile = ({ isOpen, onClose, data }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 id="modal-headline" className="text-2xl font-bold text-gray-800">Thông tin khách hàng</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
                aria-label="Đóng"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Online Status Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${data.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {data.isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}
              </span>
              {data.lastLoginTime && (
                <span className="ml-2 text-sm text-gray-500">
                  {data.isOnline 
                    ? `Online từ: ${new Date(data.lastLoginTime).toLocaleString('vi-VN')}` 
                    : `Đăng nhập cuối: ${new Date(data.lastLoginTime).toLocaleString('vi-VN')}`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin cơ bản</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Username</span>
                    <span className="font-medium">{data.username}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Họ tên</span>
                    <span className="font-medium">{data.name || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Mã giới thiệu</span>
                    <span className="font-medium">{data.idRef || 'Không có'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Level</span>
                    <span className="font-medium">VIP {data.level}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Trạng thái tài khoản</span>
                    <span className={`font-medium ${data.isLook ? 'text-green-600' : 'text-red-600'}`}>
                      {data.isLook ? 'Đã mở' : 'Đã khóa'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin tài chính</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Số dư</span>
                    <span className="font-medium text-green-600">{formatCurrency(data.totalAmount)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Số tiền đóng băng</span>
                    <span className="font-medium text-orange-500">{formatCurrency(data.totalFreeze)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Hoa hồng</span>
                    <span className="font-medium text-blue-600">{formatCurrency(data.moneyComissions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin ngân hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Tên ngân hàng</span>
                  <span className="font-medium">{data.bankName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Số tài khoản</span>
                  <span className="font-medium">{data.banKNumber || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Chủ tài khoản</span>
                  <span className="font-medium">{data.nameUserBank || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
