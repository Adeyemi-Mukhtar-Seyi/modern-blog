import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { socket } from '../../lib/socket';

import { queryKeys } from '../../constants/queryKeys';

const PostSocketListener = () => {

  const queryClient =
    useQueryClient();

  useEffect(() => {

    socket.on(
      'new-post',
      (newPost) => {

        console.log(
          'NEW POST RECEIVED:',
          newPost
        );

        queryClient.setQueryData(
          queryKeys.posts.all,

          (oldData: any) => {

            if (!oldData) {
              return oldData;
            }

            return {

              ...oldData,

              pages:
                oldData.pages.map(
                  (
                    page: any,
                    index: number
                  ) => {

                    if (index === 0) {

                      const exists =
                        page.posts.some(
                          (post: any) =>
                            post._id ===
                            newPost._id
                        );

                      if (exists) {
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

                    return page;
                  }
                ),
            };
          }
        );
      }
    );

    return () => {

      socket.off('new-post');
    };

  }, [queryClient]);

  return null;
};

export default PostSocketListener;