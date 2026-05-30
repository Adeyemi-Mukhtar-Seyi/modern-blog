import {
  FallbackProps,
} from 'react-error-boundary';

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {

  return (

    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">

        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred.'}
        </p>

        <button
          onClick={resetErrorBoundary}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>

      </div>

    </div>
  );
};

export default ErrorFallback;