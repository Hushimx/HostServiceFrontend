// app/checkin/[roomId]/loading.tsx
export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Checking room availability...</p>
      </div>
    );
  }
  