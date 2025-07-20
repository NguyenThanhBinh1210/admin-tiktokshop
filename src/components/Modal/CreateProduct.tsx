import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createProduct } from '~/apis/product.api';
import { toast } from 'react-toastify';
import { getAllCategory } from '~/apis/product.api';
import Select from 'react-select';

const CreateProduct = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [img, setImage] = useState<string>('');
  const [ratio, setRatio] = useState<number | string>('');
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; nameCategory: string }[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const mutation = useMutation((body: any) => createProduct(body), {
    onSuccess: () => {
      toast.success('Thành công!');
      onClose();
    },
    onError: () => {
      toast.warn('Lỗi!');
    },
  });

  useQuery('categories', getAllCategory, {
    onSuccess: (data) => {
      setCategories(data.data);
    },
    cacheTime: 30000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      title,
      image: img,
      ratio,
      price,
      description,
      categories: selectedCategories,
    };

    mutation.mutate(body);
  };

  const options = categories.map((category) => ({
    value: category._id,
    label: category.nameCategory || 'Tên danh mục',
  }));

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      onClick={handleModalClick}
      className={`${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } fixed bg-[#02020246] dark:bg-[#ffffff46] top-0 left-0 right-0 z-50 w-[100vw] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] transition-all`}
    >
      <div
        ref={modalRef}
        className="relative z-100 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] max-w-2xl tablet:max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Xem/Sửa sản phẩm</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Hình ảnh
                </label>
                <input
                  required
                  type="text"
                  id="image"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Nhập link hình ảnh"
                  value={img}
                  onChange={(e) => setImage(e.target.value)}
                />
                {img && (
                  <div className="mt-4">
                    <img
                      src={img}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        toast.error('Đường dẫn hình ảnh không hợp lệ');
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tên
                </label>
                <input
                  required
                  type="text"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Tên sản phẩm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Chọn Danh Mục
                </label>
                <Select
                  isMulti
                  options={options}
                  onChange={(selectedOptions: any) => {
                    setSelectedCategories(selectedOptions.map((option: any) => option.value));
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  id="category-select"
                />
              </div>
              <div>
                <h4 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Danh Mục Đã Chọn:</h4>
                <ul className="list-disc pl-5">
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find((c) => c._id === categoryId);
                    return (
                      <li key={categoryId} className="text-gray-800 dark:text-gray-200">
                        {category?.nameCategory || 'Tên danh mục'}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label htmlFor="ratio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Lợi nhuận
                  </label>
                  <input
                    required
                    type="number"
                    id="ratio"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="%"
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Giá
                  </label>
                  <input
                    required
                    type="number"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mô tả
                </label>
                <textarea
                  required
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Thêm Sản Phẩm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
