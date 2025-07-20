import classNames from 'classnames'
import { createSearchParams, Link, useLocation } from 'react-router-dom'
interface Props {
  queryConfig: any
  pageSize?: number
}
const range = 2
const PaginateAdmin = ({ queryConfig, pageSize }: Props) => {
  const { pathname } = useLocation()
  const linkToPage = pathname.split('/')[1]
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button
            key={index}
            className='w-[30px] cursor-default h-[30px] rounded-[10px] text-textsearchColor font-[600] text-[16px]'
          >
            ...
          </button>
        )
      }
      return null
    }
    if (pageSize)
      return Array(pageSize)
        .fill(0)
        .map((_, index) => {
          const pageNumber = index + 1
          if (page <= range * 2 + 1 && pageNumber > page + range && pageNumber < pageSize - range + 1) {
            return renderDotAfter(index)
          } else if (page > range * 2 + 1 && page < pageSize - range * 2) {
            if (pageNumber < page - range && pageNumber > range) {
              return renderDotBefore(index)
            } else if (pageNumber > page + range && pageNumber < pageSize - range + 1) {
              return renderDotAfter(index)
            }
          } else if (page >= pageSize - range * 2 && pageNumber > range && pageNumber < page - range) {
            return renderDotBefore(index)
          }
          return (
            <Link
              key={index}
              to={{
                pathname: `/${linkToPage}`,
                search: createSearchParams({
                  ...queryConfig,
                  page: pageNumber.toString()
                }).toString()
              }}
            >
              <button
                className={classNames('', {
                  'px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                    pageNumber === page,
                  'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                    pageNumber !== page
                })}
              >
                {pageNumber}
              </button>
            </Link>
          )
        })
  }
  return (
    <nav aria-label='Page navigation example' className='mx-auto'>
      <ul className='inline-flex items-center -space-x-px'>
        <li>
          {page === 1 ? (
            <button
              disabled
              className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <span className='sr-only'>Previous</span>
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          ) : (
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
              className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <span className='sr-only'>Previous</span>
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          )}
        </li>
        <li>{renderPagination()}</li>
        <li>
          {page === pageSize ? (
            <button
              disabled
              className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <span className='sr-only'>Next</span>
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          ) : (
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
              className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <span className='sr-only'>Next</span>
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default PaginateAdmin
