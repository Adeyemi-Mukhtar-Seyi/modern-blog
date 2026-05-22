import {
  useEffect,
  useRef,
} from 'react';

import PostCard from '../components/PostCard';

import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';

import {
  useInfinitePosts,
} from '../hooks/useInfinitePosts';

import type {
  Post,
} from '../types';



const FeedPage = () => {

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();



  const observerRef =
    useRef<HTMLDivElement | null>(
      null
    );



  useEffect(() => {

    const observer =
      new IntersectionObserver(
        (entries) => {

          if (
            entries[0].isIntersecting &&
            hasNextPage
          ) {

            fetchNextPage();
          }
        },
        {
          threshold: 1,
        }
      );



    if (observerRef.current) {

      observer.observe(
        observerRef.current
      );
    }



    return () => {

      observer.disconnect();
    };

  }, [
    fetchNextPage,
    hasNextPage,
  ]);



  const allPosts =
    data?.pages.flatMap(
      (page) => page.posts
    ) || [];



  // LOADING
  if (isLoading) {

    return (

      <div className="max-w-4xl mx-auto px-4 py-8 grid gap-6">

        {Array.from({
          length: 6,
        }).map((_, index) => (

          <PostCardSkeleton
            key={index}
          />
        ))}

      </div>
    );
  }



  // ERROR
  if (isError) {

    return (

      <p className="text-center py-10 text-red-500">

        Failed to load feed.

      </p>
    );
  }



  return (

    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold mb-3">

          Live Feed

        </h1>

        <p className="text-gray-600">

          Discover latest posts from the community

        </p>

      </div>



      {/* POSTS */}
      <div className="space-y-8">

        {allPosts.length > 0 ? (

          allPosts.map(
            (post: Post) => (

              <PostCard
                key={post._id}
                post={post}
              />
            )
          )

        ) : (

          <p className="text-center text-gray-500">

            No posts available.

          </p>
        )}
      </div>



      {/* OBSERVER */}
      <div
        ref={observerRef}
        className="h-10"
      />



      {/* NEXT PAGE LOADING */}
      {isFetchingNextPage && (

        <div className="grid gap-6 mt-6">

          {[...Array(2)].map(
            (_, index) => (

              <PostCardSkeleton
                key={index}
              />
            )
          )}

        </div>
      )}

    </div>
  );
};

export default FeedPage;