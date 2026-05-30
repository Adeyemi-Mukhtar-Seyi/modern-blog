import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isShowingError = false;
// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem('token');

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(

  // SUCCESS
  (response) => {

    return response;
  },

  // ERROR
  (error) => {

  const message =
    error.response?.data?.message ||

    error.message ||

    'Something went wrong';

  // PREVENT DUPLICATE TOASTS
  if (!isShowingError) {

    isShowingError = true;

    toast.error(message);

    setTimeout(() => {

      isShowingError = false;

    }, 2000);
  }

  // UNAUTHORIZED
  if (
    error.response?.status === 401
  ) {

    localStorage.removeItem(
      'token'
    );

    if (
      window.location.pathname !==
      '/login'
    ) {

      window.location.href =
        '/login';
    }
  }

  console.error(
    'API ERROR:',
    message
  );

  return Promise.reject({
    ...error,
    message,
  });
}
);

export default axiosInstance;