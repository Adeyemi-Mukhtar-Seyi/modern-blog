import type {
  FallbackProps,
} from 'react-error-boundary';


const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">

        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          An unexpected error occurred.
        </p>

        <div className="bg-gray-100 p-4 rounded text-left text-sm text-red-500 overflow-auto mb-6">

          {error instanceof Error
            ? error.message
            : 'Unknown error'}

        </div>

        <button
          onClick={resetErrorBoundary}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>

      </div>
    </div>
  );
};

export default ErrorFallback;