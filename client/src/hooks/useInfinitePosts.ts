import {
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  getPosts,
} from '../api/posts';

import {
  queryKeys,
} from '../constants/queryKeys';



export const useInfinitePosts =
  () => {

    return useInfiniteQuery({

      queryKey: ['posts'],

      initialPageParam: 1,

      queryFn: async ({
        pageParam = 1,
      }) => {

        console.log(
          'Fetching page:',
          pageParam
        );

        return getPosts(
          Number(pageParam)
        );
      },

      getNextPageParam:
        (lastPage) =>
          lastPage.nextPage,
    });
  };