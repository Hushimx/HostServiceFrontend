import React from 'react';

interface ErrorProps {
  message?: string; // Optional error message
  onRetry?: () => void; // Retry function
}

const Error: React.FC<ErrorProps> = ({
  message = 'Oops! Something went wrong.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 11.001 10a8 8 0 0117.998 0zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1 1 0 110-2 1 1 0 110 2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="mt-6 text-xl font-semibold text-gray-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:ring focus:ring-purple-300 transition-all"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default Error;
