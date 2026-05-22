import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { likePost } from '../../api/posts';

import { queryKeys } from '../../lib/queryKeys';

import type { Post } from '../../types';



export const useLikePost = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: likePost,



    // OPTIMISTIC UPDATE
    onMutate: async (postId) => {

      // CANCEL ACTIVE REQUESTS
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts,
      });

      // SNAPSHOT PREVIOUS CACHE
      const previousPosts =
        queryClient.getQueryData<Post[]>(
          queryKeys.posts
        );



      // UPDATE CACHE IMMEDIATELY
      queryClient.setQueryData<Post[]>(
        queryKeys.posts,
        (oldPosts) => {

          if (!oldPosts) return [];

          return oldPosts.map((post) => {

            if (post._id !== postId) {
              return post;
            }

            const userId =
              localStorage.getItem(
                'userId'
              );

            const hasLiked =
              post.likes?.includes(
                userId || ''
              );

            return {

              ...post,

              likes: hasLiked
                ? post.likes.filter(
                    (id) => id !== userId
                  )
                : [
                    ...post.likes,
                    userId || '',
                  ],

              likesCount: hasLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            };
          });
        }
      );



      // RETURN ROLLBACK DATA
      return { previousPosts };
    },



    // ROLLBACK IF FAILED
    onError: (
      _error,
      _postId,
      context
    ) => {

      if (context?.previousPosts) {

        queryClient.setQueryData(
          queryKeys.posts,
          context.previousPosts
        );
      }
    },



    // ALWAYS SYNC SERVER
    onSettled: async () => {

      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};