import axiosInstance from './axios';



//GET SINGLE POST
export const getPosts = async (
  pageParam = 1
) => {

  const { data } =
    await axiosInstance.get(
      `/posts?page=${pageParam}`
    );

  return data;
};

export const getPostBySlug = async (
  slug: string
) => {

  const response =
    await axiosInstance.get(
      `/posts/${slug}`
    );

  return response.data;
};



// CREATE POST
export const createPost = async (
  formData: FormData
) => {

  const response =
    await axiosInstance.post(
      '/posts',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

  return response.data;
};



// UPDATE POST
export const updatePost = async ({
  id,
  formData,
}: {
  id: string;

  formData: FormData;
}) => {

  const response =
    await axiosInstance.put(
      `/posts/${id}`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );

  return response.data;
};



// DELETE POST
export const deletePost = async (
  id: string
) => {

  const response =
    await axiosInstance.delete(
      `/posts/${id}`
    );

  return response.data;
};



// LIKE POST
export const likePost = async (
  postId: string
) => {

  const response =
    await axiosInstance.put(
      `/posts/${postId}/like`
    );

  return response.data;
};