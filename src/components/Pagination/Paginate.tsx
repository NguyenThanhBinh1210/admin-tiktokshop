import React from 'react';

interface Props {
  totalPages: number;
  handlePageChange: (currentPage: number) => void;
  currentPage: number;
}

const Paginate = ({ totalPages, handlePageChange, currentPage }: Props) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const firstPage = Math.max(1, currentPage - 1);
      const lastPage = Math.min(totalPages, currentPage + 1);

      if (currentPage > maxVisiblePages - 1) {
        pageNumbers.push(1);
        if (currentPage > maxVisiblePages) {
          pageNumbers.push('...');
        }
      }

      for (let i = firstPage; i <= lastPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - maxVisiblePages + 1) {
        if (currentPage < totalPages - maxVisiblePages) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
          currentPage === number ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : ''
        }`}
        onClick={() => handlePageChange(typeof number === 'number' ? number : currentPage)}
      >
        {number}
      </button>
    ));
  };

  return (
    <nav aria-label='Page navigation example' className='mx-auto'>
      <ul className='flex items-center -space-x-px h-10 text-base'>
        {currentPage !== 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            <span className='sr-only'>Previous</span>
            <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6 10'>
              <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 1 1 5l4 4' />
            </svg>
          </button>
        )}
        {renderPageNumbers()}
        {currentPage !== totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            <span className='sr-only'>Next</span>
            <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6 10'>
              <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='m1 9 4-4-4-4' />
            </svg>
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Paginate;
