// Unauthorized.jsx
import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Không có quyền truy cập</h1>
        <p className="text-lg">Bạn không có quyền truy cập vào trang này.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
