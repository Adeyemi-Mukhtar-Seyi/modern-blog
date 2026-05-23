import { useEffect } from 'react';

import { socket } from '../lib/socket';

import { queryClient } from '../lib/queryClient';

import { queryKeys } from '../lib/queryKeys';

import type { Post } from '../types';

export const useRealtimePosts = () => {

  useEffect(() => {

    socket.on(
      'new-post',
      (newPost: Post) => {

        queryClient.setQueryData(
          queryKeys.posts,
          (oldData: any) => {

            if (!oldData) return oldData;

            // INFINITE QUERY SUPPORT
            if (oldData.pages) {

              return {

                ...oldData,

                pages: oldData.pages.map(
                  (
                    page: any,
                    index: number
                  ) => {

                    // ONLY FIRST PAGE
                    if (index !== 0) {
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
                ),
              };
            }

            // NORMAL QUERY SUPPORT
            return [
              newPost,
              ...oldData,
            ];
          }
        );
      }
    );

    return () => {

      socket.off('new-post');
    };

  }, []);
};