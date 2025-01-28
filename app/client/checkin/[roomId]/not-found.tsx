// app/checkin/[roomId]/not-found.tsx
export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Room Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn’t find the room you’re looking for. Please check the room ID and try again.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          Go Back to Home
        </a>
      </div>
    );
  }
  