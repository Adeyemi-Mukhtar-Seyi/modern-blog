import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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

    // BACKEND MESSAGE
    const message =
      error.response?.data?.message ||

      error.message ||

      'Something went wrong';

    // UNAUTHORIZED
    if (
      error.response?.status === 401
    ) {

      // REMOVE TOKEN
      localStorage.removeItem(
        'token'
      );

      // OPTIONAL REDIRECT
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