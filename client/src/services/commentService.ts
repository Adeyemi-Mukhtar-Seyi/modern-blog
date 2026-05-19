import axiosInstance from '../api/axios';

export const getComments = async (
  postId: string,
  page: number
) => {
  const { data } = await axiosInstance.get(
    `/comments/${postId}?page=${page}`
  );

  return data;
};

export const createComment = async (
  postId: string,
  content: string,
  quotedCommentId?: string
) => {
  const { data } = await axiosInstance.post('/comments', {
    postId,
    content,
    quotedCommentId,
  });

  return data;
};

export const likeComment = async (commentId: string) => {
  const { data } = await axiosInstance.put(
    `/comments/${commentId}/like`
  );

  return data;
};

export const dislikeComment = async (commentId: string) => {
  const { data } = await axiosInstance.put(
    `/comments/${commentId}/dislike`
  );

  return data;
};