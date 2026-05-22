import Skeleton from 'react-loading-skeleton';



const PostDetailsSkeleton = () => {

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto bg-white mt-10 p-6 rounded-lg shadow">

        <Skeleton height={300} />

        <div className="mt-6">
          <Skeleton height={50} />
        </div>

        <div className="flex gap-4 mt-4">
          <Skeleton width={120} />
          <Skeleton width={100} />
        </div>

        <div className="mt-8">
          <Skeleton count={10} />
        </div>

      </div>
    </div>
  );
};

export default PostDetailsSkeleton;