import {
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  getPosts,
} from '../api/posts';

import {queryKeys,} from './constants/queryKeys';



export const useInfinitePosts =
  () => {

    return useInfiniteQuery({

      queryKey:
        queryKeys.posts.all,

      queryFn:
        ({ pageParam }) =>
          getPosts(pageParam),

      initialPageParam: 1,

      getNextPageParam:
        (lastPage) =>
          lastPage.nextPage,
    });
  };