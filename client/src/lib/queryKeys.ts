export const queryKeys = {
  posts: ['posts'] as const,

  post: (postId: string) =>
    ['posts', postId] as const,

  comments: (postId: string) =>
    ['comments', postId] as const,

  currentUser: ['current-user'] as const,
};