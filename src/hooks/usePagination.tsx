/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

const usePagination = (itemsPerPage: number, dataArray: any) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(dataArray.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = dataArray.slice(startIndex, endIndex)
  return { currentPage, totalPages, currentData, setCurrentPage }
}

export default usePagination
