import { notFound } from "next/navigation";
import Login from "./login";
import { UUID } from "crypto";

async function fetchRoom(roomId: UUID) {
  try {
    const res = await fetch(`http://127.0.0.1:3333/client/room/${roomId}`, {
      cache: "no-store", // Ensures fresh data fetch
    });

    // Handle 404 explicitly
    if (res.status === 404) {
      return { notFound: true };
    }

    // Throw an error for other non-2xx statuses
    if (!res.ok) {
      throw new Error(`Failed to fetch room: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching room:", error);
    return { error: true }; // Return an error flag for unknown issues
  }
}

export default async function CheckRoomPage({ params }: { params: { roomId: UUID } }) {
  const { roomId } =  await params;

  // Fetch room data
  const room = await fetchRoom(roomId);
  
  // Simulate delay (for example, loading state testing)

  if (room?.notFound) {
    notFound();
  }

  if (room?.error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
        <h1 className="text-3xl font-bold mb-4">المعذره</h1>
        <p className="text-lg text-gray-600 mb-6">حدث خطاء غير متوقع</p>
        <a
          href="/"
          className="px-6 py-3 bg-purple-600 text-white rounded-md shadow  transition"
        >
          العودة للصفحة الرئيسية
        </a>
      </div>
    );
  }

  return <Login uuid={roomId} />;
}
