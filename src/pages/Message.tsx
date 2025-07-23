/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { getAllChat, checkView } from '~/apis/chat.api';
import { deleteMessage } from '~/apis/product.api';
import Loading from '~/components/Loading/Loading';
import ShowMessage from '~/components/Modal/ShowMessage';
import Paginate from '~/components/Pagination/Paginate';
import SearchHeader from '~/components/Search/Search';
import { AppContext } from '~/contexts/app.context';
import { ShortenedText } from '~/utils/utils';
const serverUrl = 'https://socket.ordersdropship.com';

const Messages = () => {
  const queryClient = useQueryClient();
  const { profile } = useContext(AppContext);

  const [data, setData] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showComment, setShowComment] = useState<any>();
  const [username, setUsername] = useState<string>();
  const [search, setSearch] = useState<string>('');

  // Fetch messages with pagination
  const { isLoading } = useQuery({
    queryKey: ['message', currentPage, search],
    queryFn: () =>
      getAllChat(currentPage, { search }).then((res: any) => {
        setData(res.data.messages);
        setTotalItems(res.data.count);
        // Calculate total pages based on count (assuming 10 items per page)
        setTotalPages(Math.ceil(res.data.count / 10));
      }),
    keepPreviousData: true,
    onError: () => {
      toast.error('Error fetching messages');
    },
    cacheTime: 60000,
  });

  // Mutation for checking view
  const updateMutation = useMutation((body: any) => {
    const data = {
      status: body.status,
    };
    return checkView(body?._id, data);
  });

  const handleUpdateView = (item: any) => {
    const newData = {
      _id: item._id,
      status: !item.status,
    };
    updateMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['message', currentPage, search]);
      },
    });
  };
  useEffect(() => {
    const socket = io(serverUrl);
    socket.on('receiveMessAdmin', () => {
      queryClient.invalidateQueries({ queryKey: ['message', currentPage, search] });
    });
    socket.on('receiveImageAdmin', () => {
      queryClient.invalidateQueries({ queryKey: ['message', currentPage, search] });
    });
  }, [queryClient]);
  // Mutation for deleting a message
  const deleteMutation = useMutation({
    mutationFn: (body: any) => deleteMessage(body),
    onError: () => {
      toast.warn('Error deleting message');
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries(['message', currentPage, search]);
    },
  });

  const handleDelete = (id: string, luuVet: string) => {
    const body = {
      id: id,
      activate: luuVet
    }
    deleteMutation.mutate(body);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page for a new search
    queryClient.invalidateQueries(['message', currentPage, search]);
  };

  return (
    <>
      <SearchHeader
        count={data.length}
        search={search}
        setSearch={setSearch}
        handleSearch={(e: any) => handleSearch(e)}
        title="tin nhắn"
      />
      <div className="flex flex-col gap-[30px] flex-1">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="relative flex-1 overflow-x-auto rounded-md shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">STT</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Username</th>
                    <th scope="col" className="px-6 py-3">Nội dung mới nhất </th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                    <th scope="col" className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, idx: number) => (
                    <tr
                      key={item._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th scope="row" className="w-[100px] px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {'#' + ((currentPage - 1) * 10 + idx + 1)}
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item?.userName}</th>
                      <th className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item?.username}</th>
                      <th className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <strong>{item?.latestContent?.userId === profile?._id ? 'Tôi:' : 'Khách:'}</strong>{' '}
                        {ShortenedText(item?.latestContent?.message)}
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item?.status || item?.latestContent?.userId === profile?._id ? (
                          <div className="text-xs w-max bg-green-400 text-white flex justify-center px-2 py-0.5 rounded-lg">Đã xem</div>
                        ) : (
                          <div className="text-xs w-max bg-yellow-400 text-white flex justify-center px-2 py-0.5 rounded-lg">Chưa xem</div>
                        )}
                      </th>
                      <th className="px-6 py-3 w-[200px] flex items-center gap-x-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <button
                          type="button"
                          onClick={() => {
                            setShowComment(item.sender);
                            handleUpdateView(item);
                            setUsername(item.username);
                            setModalOpen(true);
                          }}
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                        >
                          Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, `${profile?.username} đã xoá tin nhắn của ${item.username}`)}
                          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          Xoá
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} entries
              </div>
              <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
          </>
        )}
      </div>
      {isModalOpen &&
        <ShowMessage data={showComment} name={username} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Messages;
