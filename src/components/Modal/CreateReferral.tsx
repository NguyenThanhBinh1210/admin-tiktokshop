import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createRef } from '~/apis/ref.api'; // Ensure your API endpoint is correct

interface CreateStaffProps {
  closeModal: () => void; // Function to close the modal
}

const CreateReferral = ({ closeModal }: CreateStaffProps) => {
  const [idRef, setIdRef] = useState('');
  const queryClient = useQueryClient();

  // Mutation to create a new referral code
  const createRefMutation = useMutation(createRef, {
    onSuccess: () => {
      toast.success('Mã giới thiệu đã được tạo!');
      queryClient.invalidateQueries('refs'); // Refetch the list after successful creation
      closeModal(); // Close the modal
    },
    onError: () => {
      toast.error('Lỗi khi tạo mã giới thiệu!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idRef.trim()) {
      createRefMutation.mutate({ idRef });
    } else {
      toast.warn('Vui lòng nhập mã giới thiệu.');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-lg font-semibold mb-4'>Tạo mã giới thiệu</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='idRef' className='block text-sm font-medium text-gray-700'>
              Mã giới thiệu
            </label>
            <input
              type='text'
              id='idRef'
              value={idRef}
              onChange={(e) => setIdRef(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Nhập mã giới thiệu'
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={closeModal}
              className='mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
            >
              Huỷ
            </button>
            <button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReferral;
