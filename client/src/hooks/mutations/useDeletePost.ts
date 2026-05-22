import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { deletePost } from '../../api/posts';

import { queryKeys } from '../../lib/queryKeys';

export const useDeletePost = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: deletePost,

    // OPTIMISTIC DELETE
    onMutate: async (postId: string) => {

      await queryClient.cancelQueries({
        queryKey: queryKeys.posts,
      });

      // SNAPSHOT
      const previousPosts =
        queryClient.getQueriesData({
          queryKey: queryKeys.posts,
        });

      // REMOVE POST IMMEDIATELY
      queryClient.setQueriesData(
        {
          queryKey: queryKeys.posts,
        },
        (oldData: any) => {

          // NORMAL PAGINATION
          if (oldData?.posts) {
            return {
              ...oldData,
              posts: oldData.posts.filter(
                (post: any) =>
                  post._id !== postId
              ),
            };
          }

          // INFINITE QUERY
          if (oldData?.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map(
                (page: any) => ({
                  ...page,
                  posts: page.posts.filter(
                    (post: any) =>
                      post._id !== postId
                  ),
                })
              ),
            };
          }

          return oldData;
        }
      );

      return { previousPosts };
    },

    // ROLLBACK
    onError: (
      _error,
      _postId,
      context
    ) => {

      context?.previousPosts?.forEach(
        ([queryKey, data]) => {

          queryClient.setQueryData(
            queryKey,
            data
          );
        }
      );
    },

    // REFRESH
    onSettled: async () => {

      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};