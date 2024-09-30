
const SkeletonLoaderAbout = () => {
  return (
    <div className="animate-pulse flex flex-col p-6">
      <div className="flex flex-col justify-between leading-7">
        <div className="mb-8">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        <div className="mb-8">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        <div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoaderAbout;
