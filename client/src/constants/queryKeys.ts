export const queryKeys = {

  posts: {

    all: ['posts'],

    detail: (slug: string) => [
      'posts',
      slug,
    ],
  },

  comments: {

    all: ['comments'],

    post: (postId: string) => [
      'comments',
      postId,
    ],
  },
};