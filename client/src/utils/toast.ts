import toast from 'react-hot-toast';

// SUCCESS
export const showSuccess = (
  message: string
) => {

  toast.success(message);
};

// ERROR
export const showError = (
  error: any
) => {

  const message =
    error?.message ||

    error?.response?.data?.message ||

    'Something went wrong';
};

// LOADING
export const showLoading = (
  message: string
) => {

  return toast.loading(message);
};

// DISMISS
export const dismissToast = (
  toastId: string
) => {

  toast.dismiss(toastId);
};