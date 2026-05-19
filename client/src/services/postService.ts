import axiosInstance from '../api/axios';

export const searchPosts = async (
  params: {
    search?: string;
    category?: string;
    subcategory?: string;
    page?: number;
  }
) => {
  const { data } =
    await axiosInstance.get('/posts/search/all', {
      params,
    });

  return data;
};