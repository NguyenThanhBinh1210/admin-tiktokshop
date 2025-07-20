import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { deleteRef, getAllRef } from '~/apis/ref.api'; // Ensure your API handles pagination
import Loading from '~/components/Loading/Loading';
import CreateReferral from '~/components/Modal/CreateReferral';
import NotReSearch from '~/components/NotReSearch/NotReSearch';
import Paginate from '~/components/Pagination/Paginate';
import SearchHeader from '~/components/Search/Search';

interface RefItem {
  _id: string;
  idRef: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: RefItem[];
}

const IdRefByStaff = () => {
  const [staff, setStaff] = useState<RefItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpenCreate, setModalOpenCreate] = useState<boolean>(false);
  const [staffModal, setStaffModal] = useState<RefItem | null>(null);
  const queryClient = useQueryClient();
  const itemsPerPage = 8; // You can change this as per your requirement

  // Fetch paginated data based on `currentPage`
  const { data: apiData, isLoading, isError } = useQuery(
    ['refs', currentPage],
    () => getAllRef(currentPage), // Call the API function
    {
      onSuccess: (data) => {
        setStaff(data.data.data); // Use the paginated data
      },
      cacheTime: 60000,
    }
  );
console.log(apiData);
  const totalPages = apiData ? apiData.data.totalPages : 0;

  // Delete mutation
  const deleteMutation = useMutation(deleteRef, {
    onSuccess: () => {
      toast.success('Đã xoá!');
      queryClient.invalidateQueries('refs');
    },
    onError: () => {
      toast.warn('Lỗi!');
    },
  });

  const handleDeleteStaff = (id: string) => {
    console.log(id);
    deleteMutation.mutate(id);
  };  

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Set the current page and refetch the data
    }
  };

  return (
    <>
      <SearchHeader
        notShowSearch
        count={staff.length}
        hanldeOpenModal={() => setModalOpenCreate(true)}
        title={'Mã giới thiệu'}
      />
      <div className='flex flex-col gap-[30px] flex-1'>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <NotReSearch />
        ) : (
          <>
            <div className='relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      STT
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      ID Ref
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Ngày tạo
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((item, idx) => (
                    <tr
                      key={item._id}
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    >
                      <td className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {'#' + ((currentPage - 1) * itemsPerPage + idx + 1)}
                      </td>
                      <td className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {item.idRef}
                      </td>
                      <td className='px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                  
                        <button
                          type='button'
                          onClick={() => handleDeleteStaff(item._id)}
                          className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginate
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
      {isModalOpenCreate && (
        <CreateReferral closeModal={() => setModalOpenCreate(false)} />
      )}
    </>
  );
};

export default IdRefByStaff;
