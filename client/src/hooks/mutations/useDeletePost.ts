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

    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};