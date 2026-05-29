import { useEffect, } from 'react';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import { useInfinitePosts, } from '../hooks/useInfinitePosts';
import type { Post, } from '../types';
import { socket } from '../lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { useInView } from 'react-intersection-observer';



const FeedPage = () => {
  console.log('FeedPage mounted');
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({
  threshold: 0,
  rootMargin: '200px',
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();





  useEffect(() => {

    socket.on(
      'new-post',
      (newPost) => {

        queryClient.setQueryData(
         queryKeys.posts,

          (oldData: any) => {

            if (!oldData) return oldData;

            return {

              ...oldData,

              pages: oldData.pages.map(
                (
                  page: any,
                  index: number
                ) => {

                  // ONLY FIRST PAGE
                  if (index === 0) {

                    // PREVENT DUPLICATES
                    const exists =
                      page.posts.some(
                        (post: any) =>
                          post._id ===
                          newPost._id
                      );

                    if (exists) {
                      return page;
                    }

                    return {

                      ...page,

                      posts: [
                        newPost,
                        ...page.posts,
                      ],
                    };
                  }

                  return page;
                }
              ),
            };
          }
        );
      }
    );

    return () => {

      socket.off('new-post');
    };

  }, [queryClient]);

  useEffect(() => {

  if (
    inView &&
    hasNextPage &&
    !isFetchingNextPage
  ) {

    console.log(
      'Fetching next page...'
    );

    fetchNextPage();
  }

  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);



  const allPosts =
    data?.pages?.flatMap(
      (page: any) =>
        page?.posts || []
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
              key={`${post._id}-${post.likesCount}`}
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
        ref={ref}
        className="h-40 flex items-center justify-center"
      >
        Loading more...
      </div>



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