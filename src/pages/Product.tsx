import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { deleteProduct, getAllProduct, searchProduct } from '~/apis/product.api';
import Loading from '~/components/Loading/Loading';
import CreateProduct from '~/components/Modal/CreateProduct';
import ShowProduct from '~/components/Modal/ShowProduct';
import Paginate from '~/components/Pagination/Paginate';
import SearchHeader from '~/components/Search/Search';

const Products = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const [showComment, setShowComment] = useState<any>();

  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: (title: string) => searchProduct(title),
    onSuccess: (data) => {
      setStaff(data.data.Products);
      setTotalPages(data.data.totalPages);
      setCurrentPage(1);
    },
    onError: () => {
      toast.warn('Lỗi tìm kiếm!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, status, customer }: { id: string; status: string; customer: string }) =>
      deleteProduct(id, status, customer),
    onSuccess: () => {
      toast.success('Đã xoá!');
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: () => {
      toast.warn('Lỗi xoá sản phẩm!');
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['product', currentPage],
    queryFn: () => getAllProduct(currentPage),
    onSuccess: (data) => {
      setStaff(data.data.Products);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
      setTotalProducts(data.data.totalProducts);
    },
    cacheTime: 30000,
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateTitle = (title: string) => {
    const maxLength = 50;
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('ID đã được sao chép vào clipboard!'))
      .catch((err) => toast.error('Lỗi khi sao chép ID!'));
  };

  const handleDeleteStaff = (id: string, status: string, customer: string) => {
    deleteMutation.mutate({ id, status, customer });
  };

  return (
    <>
      <SearchHeader
        count={totalProducts}
        search={search}
        setSearch={setSearch}
        handleSearch={(e: any) => {
          e.preventDefault();
          searchMutation.mutate(search);
        }}
        hanldeOpenModal={() => setModalOpenCreate(true)}
        title="sản phẩm"
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
                    <th className="px-6 py-3">STT</th>
                    <th className="px-6 py-3">Mã sản phẩm</th>
                    <th className="px-6 py-3">Ảnh</th>
                    <th className="px-6 py-3">Tên</th>
                    <th className="px-6 py-3">Categories</th>
                    <th className="px-6 py-3">Đơn giá</th>
                    <th className="px-6 py-3">Lợi nhuận</th>
                    <th className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-3">{(currentPage - 1) * 10 + idx + 1}</td>
                      <td className="px-2 py-3">
                        {item._id}
                        <button
                          onClick={() => copyToClipboard(item._id)}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Copy
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <img className="w-10 h-10 rounded-full" src={item.image} alt="product" />
                      </td>
                      <td className="px-6 py-3">{truncateTitle(item.title)}</td>
                      <td className="px-6 py-3">
                        {item.categories.map((category: any) => category.nameCategory).join(', ')}
                      </td>
                      <td className="px-6 py-3">{item.price}$</td>
                      <td className="px-6 py-3">{item.ratio}%</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteStaff(item._id, `Đã xoá sản phẩm ${item.title}`, '')}
                          className="text-white bg-red-700 hover:bg-red-800 px-2 py-1 rounded"
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginate totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
      <ShowProduct data={showComment} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <CreateProduct isOpen={isModalOpenCreate} onClose={() => setModalOpenCreate(false)} />
    </>
  );
};

export default Products;
