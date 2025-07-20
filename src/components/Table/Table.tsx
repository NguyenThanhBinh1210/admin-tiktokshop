const CommonTable = ({ data, columns, handleDelete, showModal, showData }: any) => {
  console.log(data)
  return (
    <div className='relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            {columns.slice(0, 6).map((column: any, index: number) => (
              <th scope='col' className='px-6 py-3' key={index}>
                {column}
              </th>
            ))}
            <th scope='col' className='px-6 py-3'>
              Hành động
            </th>
          </tr>
        </thead>
        {data.length !== 0 && (
          <tbody>
            {data.map((item: any, idx: number) => (
              <tr
                key={item._id}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover-bg-gray-600'
              >
                {columns.slice(0, 6).map((column: any, index: number) => (
                  <td
                    key={index}
                    className={`${
                      index === 0 ? 'w-[100px] ' : ''
                    }px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white`}
                  >
                    {column === 'stt' ? (
                      `#${idx + 1}`
                    ) : column === 'avatar' ? (
                      item.avatar[0] == null ? (
                        <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'>
                          <svg
                            className='absolute w-12 h-12 text-gray-400 -left-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                              clipRule='evenodd'
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        <img
                          className='aa'
                          style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                          src={item.avatar}
                          alt='avatar'
                        />
                      )
                    ) : (
                      item[column]
                    )}
                  </td>
                ))}
                <td className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                  <button
                    type='button'
                    onClick={() => {
                      showModal(true)
                      showData(item)
                    }}
                    className='text-white bg-blue-700 hover-bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-900'
                  >
                    Xem
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDelete(item._id)}
                    className='text-white bg-red-700 hover-bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover-bg-red-700 dark:focus:ring-red-900'
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}

export default CommonTable
