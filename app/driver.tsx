import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const DriverPage = () => {
  const router = useRouter();
  const { type, code } = router.query;

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Fetch the order when type and code are available
  useEffect(() => {
    if (type && code) {
      validateDriverCode();
    }
  }, [type, code]);

  const validateDriverCode = async () => {
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/driver/validate?type=${type}&code=${code}`,
        { method: "PATCH" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to validate driver code.");
      }
      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrder = async () => {
    if (!order) {
      setError("No order to update. Validate the driver code first.");
      return;
    }

    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/driver/update?type=${type}&orderId=${order.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, notes }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update the order.");
      }
      alert("Order updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Driver Portal</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {order ? (
        <div className="bg-white text-purple-900 rounded-lg shadow-md p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <p className="mb-2">
            <strong>Order ID:</strong> {order.id}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="mb-2">
            <strong>Notes:</strong> {order.notes || "None"}
          </p>

          <div className="mb-4">
            <label className="block mb-2 font-bold text-lg">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border-2 border-yellow-400 rounded-md text-purple-900"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold text-lg">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border-2 border-yellow-400 rounded-md text-purple-900"
            />
          </div>

          <button
            onClick={updateOrder}
            className="w-full bg-yellow-400 text-purple-900 font-bold py-2 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Update Order
          </button>
        </div>
      ) : (
        <p className="text-lg font-bold">Validating driver code...</p>
      )}
    </div>
  );
};

export default DriverPage;
