import Skeleton from 'react-loading-skeleton';



const PostCardSkeleton = () => {

  return (

    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">

      <Skeleton height={32} />

      <div className="mt-4">
        <Skeleton count={4} />
      </div>

      <div className="flex gap-4 mt-6">

        <Skeleton width={100} />

        <Skeleton width={60} />

        <Skeleton width={80} />

      </div>

    </div>
  );
};

export default PostCardSkeleton;