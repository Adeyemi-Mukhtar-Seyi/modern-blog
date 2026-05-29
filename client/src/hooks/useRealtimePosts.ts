import { useEffect } from 'react';

import { socket } from '../lib/socket';

import { queryClient } from '../lib/queryClient';

import { queryKeys } from '../lib/queryKeys';

import type { Post } from '../types';

export const useRealtimePosts = () => {

  useEffect(() => {

    // NEW POSTS
    socket.on(
      'new-post',
      (newPost: Post) => {

        queryClient.setQueriesData(
            {
                queryKey: queryKeys.posts,
            },
            (oldData: any) => {

                if (!oldData) {
                return oldData;
                }

                // NORMAL QUERY SUPPORT
                if (oldData.posts) {

                return {

                    ...oldData,

                    posts: [
                    newPost,
                    ...oldData.posts,
                    ],
                };
                }

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

                return oldData;
            }
            );
      }
    );



    // REALTIME COMMENTS
        socket.on(
        'new-comment',
        () => {

            queryClient.invalidateQueries({
            queryKey: ['comments'],
            });
        }
        );

    return () => {

      socket.off('new-post');
      socket.off('new-comment');
    };

  }, []);
};