
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col p-6">
      <div className="flex flex-col">
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="flex">
          <div className="h-10 bg-gray-300 rounded w-[5rem] mr-4"></div>
          <div className="h-10 bg-gray-300 rounded w-[8rem]"></div>
        </div>
      </div>
      <div className="mt-6 flex flex-col justify-normal items-start min-h-svh">
        <div className="h-[250px] bg-gray-300 rounded w-full"></div>
        <div className="w-full flex flex-col justify-between h-[180px] mt-5">
          <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
        <div className="mt-7 flex justify-between w-full items-center">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded w-[9rem]"></div>
        </div>
        <div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mt-3"></div>
          <div className="h-4 bg-gray-300 rounded w-full mt-2"></div>
        </div>
        <div className="flex w-[19rem] justify-between mt-4">
          <div className="w-[70px] bg-gray-300 h-[4rem] rounded-sm"></div>
          <div className="w-[70px] bg-gray-300 h-[4rem] rounded-sm"></div>
          <div className="w-[70px] bg-gray-300 h-[4rem] rounded-sm"></div>
          <div className="w-[70px] bg-gray-300 h-[4rem] rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
