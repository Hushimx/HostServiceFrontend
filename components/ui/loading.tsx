import React from 'react';

interface LoadingProps {
  message?: string; // Optional loading message
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-foreground">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-purple-600 animate-spin"></div>
      </div>
      <p className="mt-6  font-medium text-white text-2xl ">{message}</p>
    </div>
  );
};

export default Loading;
