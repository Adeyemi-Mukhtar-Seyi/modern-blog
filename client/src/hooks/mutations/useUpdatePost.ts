import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { updatePost } from '../../api/posts';

import { queryKeys } from '../../lib/queryKeys';



export const useUpdatePost = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: updatePost,

    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};