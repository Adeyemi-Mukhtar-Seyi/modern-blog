import {
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';

import toast from 'react-hot-toast';

export const queryClient =
  new QueryClient({

    queryCache:
      new QueryCache({

        onError: (
          error: any
        ) => {

          toast.error(
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong'
          );
        },
      }),

    mutationCache:
      new MutationCache({

        onError: (
          error: any
        ) => {

          toast.error(
            error?.response?.data?.message ||
            error?.message ||
            'Mutation failed'
          );
        },
      }),

    defaultOptions: {

      queries: {

        staleTime: 1000 * 60,

        refetchOnWindowFocus: false,

        refetchOnReconnect: true,

        retry: 1,
      },
    },
  });