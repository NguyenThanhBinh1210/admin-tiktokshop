import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  node: any
  handleRemoveCat: any
}
const TreeNode = ({ node, handleRemoveCat }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.children.length > 0

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <tr>
        <td className='px-6 py-4 tablet:hidden'>{node.id}</td>
        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
          {node.name}
        </th>
        <td className='px-6 py-4 flex gap-x-[10px]'>
          <Link to={`/category/${node.id}`} className=''>
            <button className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800'>
              <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                Sửa
              </span>
            </button>
          </Link>{' '}
          <button
            onClick={() => handleRemoveCat(node.id)}
            className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
          >
            <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
              Xoá
            </span>
          </button>
        </td>
        <td>
          {hasChildren && (
            <button
              onClick={handleToggle}
              className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
            >
              <span className='relative px-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
                {!isOpen ? 'Xem thêm' : 'Rút gọn'}
              </span>
            </button>
          )}
        </td>
      </tr>

      {hasChildren &&
        isOpen &&
        node.children.map((childNode: any) => (
          <TreeNode key={childNode.id} node={childNode} handleRemoveCat={handleRemoveCat} />
        ))}
    </>
  )
}
export default TreeNode
