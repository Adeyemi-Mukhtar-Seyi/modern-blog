import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  createComment,
  likeComment,
  dislikeComment,
} from '../services/commentService';

export const useCreateComment = (
  postId: string,
  page: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      quotedComment,
    }: {
      content: string;
      quotedComment?: string;
    }) =>
      createComment(postId, content, quotedComment),

    onSuccess: () => {
      toast.success('Comment added');

      queryClient.invalidateQueries({
        queryKey: ['comments', postId, page],
      });
    },

    onError: () => {
      toast.error('Failed to add comment');
    },
  });
};



export const useLikeComment = (
  postId: string,
  page: number,
  userId?: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeComment,

    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({
        queryKey: ['comments', postId, page],
      });

      const previousData = queryClient.getQueryData([
        'comments',
        postId,
        page,
      ]);

      queryClient.setQueryData(
        ['comments', postId, page],
        
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: oldData.comments.map((comment: any) =>
              comment._id === commentId
                ? {
                    ...comment,

                    likesCount: comment.likes.includes(
                        userId
                    )
                        ? comment.likesCount - 1
                        : comment.likesCount + 1,

                    likes: comment.likes.includes(
                        userId
                    )
                        ? comment.likes.filter(
                            (id: string) =>
                            id !== userId
                        )
                        : [
                            ...comment.likes,
                            userId || '',
                        ],
                    }
                : comment
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ['comments', postId, page],
        context?.previousData
      );

      toast.error('Failed to like comment');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId, page],
      });
    },
  });
};

export const useDislikeComment = (
  postId: string,
  page: number,
  userId?: string
) => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: dislikeComment,

    // OPTIMISTIC UPDATE
    onMutate: async (
      commentId: string
    ) => {

      await queryClient.cancelQueries({
        queryKey: [
          'comments',
          postId,
          page,
        ],
      });

      const previousData =
        queryClient.getQueryData([
          'comments',
          postId,
          page,
        ]);

      queryClient.setQueryData(
        [
          'comments',
          postId,
          page,
        ],

        (oldData: any) => {

          if (!oldData) {
            return oldData;
          }

          return {

            ...oldData,

            comments:
              oldData.comments.map(
                (comment: any) => {

                  if (
                    comment._id !==
                    commentId
                  ) {
                    return comment;
                  }

                  return {

                    ...comment,

                  dislikes: comment.dislikes.includes(
                    userId
                  )
                    ? comment.dislikes.filter(
                        (id: string) =>
                          id !== userId
                      )
                    : [
                        ...comment.dislikes,
                        userId || '',
                      ],
                  };
                }
              ),
          };
        }
      );

      return {
        previousData,
      };
    },

    // ROLLBACK
    onError: (
      _error,
      _variables,
      context
    ) => {

      queryClient.setQueryData(
        [
          'comments',
          postId,
          page,
        ],

        context?.previousData
      );

      toast.error(
        'Failed to dislike comment'
      );
    },

    // REFRESH
    onSettled: () => {

      queryClient.invalidateQueries({
        queryKey: [
          'comments',
          postId,
          page,
        ],
      });
    },
  });
};