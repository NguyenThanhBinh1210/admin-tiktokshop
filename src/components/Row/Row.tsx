import React from 'react'

const Row = ({ item, idx }: any) => {
  return (
    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
      <th scope='row' className='w-[100px] px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
        {'#' + (idx + 1)}
      </th>
      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
        {item.author?.username}
      </th>
      <th scope='row' className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
        {item.key}
      </th>
      <th
        scope='row'
        className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
      >
        <label className='relative inline-flex items-center cursor-pointer'>
          <input type='checkbox' className='sr-only peer' checked={item.code === 'block' ? false : true} />
          <div className="w-11 h-6 bg-gray-200  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
        </label>
        <button
          type='button'
          // onClick={() => handleRemove(item._id)}
          className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
        >
          Xoá
        </button>
      </th>
    </tr>
  )
}

export default Row
