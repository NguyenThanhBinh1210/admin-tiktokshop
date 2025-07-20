const Chat = () => {
  return (
    <div className='grid grid-cols-4 h-[70%] pb-4'>
      <div className='col-span-1 mobile:fixed top-0 right-0 mobile:h-full h-[100%] mobile:w-[60%] z-30 flex flex-col  rounded-l-md overflow-y-auto bg-gray-50 '>
        <div className='p-5 font-bold'>Danh sách chat</div>
        {[1, 2, 3, 4, 7, 8, 8, 9, 6, 6, 6].map((item: any, index: number) => (
          <div className='bg-slate-100 font-se py-6 border-b px-5 cursor-pointer' key={index}>
            Nguyễn Thanh Bình
          </div>
        ))}
      </div>
      <div className='col-span-3 mobile:col-span-4 mobile:border-l h-[100%] mobile:rounded-l-md border-y relative border-r rounded-r-md h-hull'>
        <div className='h-10 w-full absolute top-0 left-0 bg-blue-500 text-white flex items-center pl-6 font-semibold'>
          Nguyễn Thanh Bình
        </div>
        <div className='max-h-[500px] my-10 overflow-y-auto'>
          <div className='h-[3000px]'></div>
        </div>
        <div className='h-[40px] flex px-5  items-center justify-center bg-blue-500 text-white absolute bottom-0 left-0 w-full mt-auto'>
          <input type='text' className='w-full py-2 text-black pl-3' />
          <div className='cursor-pointer p-2 w-max bg-blue-600'>Gửi</div>
        </div>
      </div>
    </div>
  )
}

export default Chat
