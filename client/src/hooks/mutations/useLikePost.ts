import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { likePost } from '../../api/posts';

import { queryKeys } from '../../lib/queryKeys';

export const useLikePost = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: likePost,

    // OPTIMISTIC UPDATE
    onMutate: async (postId: string) => {
      console.log('OPTIMISTIC UPDATE');

      await queryClient.cancelQueries({
        queryKey: queryKeys.posts,
      });

      // SNAPSHOT
      const previousPosts =
        queryClient.getQueriesData({
          queryKey: queryKeys.posts,
        });

      const currentUser: any =
        queryClient.getQueryData(
          queryKeys.currentUser
        );

      const userId =
        currentUser?._id ||
        currentUser?.id;

      if (!userId) {

        return {
          previousPosts,
        };
      }

      // UPDATE POSTS CACHE
      queryClient.setQueriesData(
        {
          queryKey: queryKeys.posts,
        },
        (oldData: any) => {

          if (!oldData) {
            return oldData;
          }

          // NORMAL QUERY
            if (oldData.posts) {

              return {
                ...oldData,

                posts: oldData.posts.map(
                  (post: any) => {

                    if (
                      post._id !== postId
                    ) {
                      return post;
                    }

                    const hasLiked =
                      post.likes.includes(
                        userId
                      );

                    return {
                      ...post,

                      likes: hasLiked
                        ? post.likes.filter(
                            (id: string) =>
                              id !== userId
                          )
                        : [
                            ...post.likes,
                            userId,
                          ],

                      likesCount: hasLiked
                        ? post.likesCount - 1
                        : post.likesCount + 1,
                    };
                  }
                ),
              };
            }

          // INFINITE QUERY
          if (oldData.pages) {

            return {

              ...oldData,

              pages: oldData.pages.map(
                (page: any) => ({

                  ...page,

                  posts: page.posts.map(
                    (post: any) => {

                      if (
                        post._id !== postId
                      ) {
                        return post;
                      }

                     const hasLiked =
                        post.likes.some(
                          (id: any) =>
                            id.toString() ===
                            userId.toString()
                        );

                      return {

                        ...post,

                        likes: hasLiked
                          ? post.likes.filter(
                              (
                                id: string
                              ) =>
                                id !==
                                userId
                            )
                          : [
                              ...post.likes,
                              userId,
                            ],

                        likesCount:
                          hasLiked
                            ? post.likesCount - 1
                            : post.likesCount + 1,
                      };
                    }
                  ),
                })
              ),
            };
          }

          return oldData;
        }
      );

      return {
        previousPosts,
      };
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

    onSuccess: (data) => {

    queryClient.setQueriesData(
      {
        queryKey: queryKeys.posts,
      },
      (oldData: any) => {

        if (!oldData) return oldData;

        // NORMAL QUERY
        if (oldData.posts) {

          return {
            ...oldData,

            posts: oldData.posts.map(
              (post: any) =>

                post._id === data.post._id
                  ? data.post
                  : post
            ),
          };
        }
        

        // INFINITE QUERY
        if (oldData.pages) {

          return {
            ...oldData,

            pages: oldData.pages.map(
              (page: any) => ({

                ...page,

                posts: page.posts.map(
                  (post: any) =>

                    post._id === data.post._id
                      ? data.post
                      : post
                ),
              })
            ),
          };
        }

        return oldData;
      }
    );
  },
  });
};