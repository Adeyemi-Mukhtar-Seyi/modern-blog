import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { createPost } from '../../api/posts';

import { queryKeys } from '../../lib/queryKeys';

export const useCreatePost = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createPost,

    onSuccess: async (
      newPost
    ) => {
      // BACKGROUND REVALIDATION
        await queryClient.refetchQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};