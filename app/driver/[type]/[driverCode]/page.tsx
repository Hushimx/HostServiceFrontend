"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const DriverPage = () => {
  const { type, driverCode } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

  useEffect(() => {
    if (type && driverCode) {
      fetchOrder(type, driverCode);
    }
  }, [type, driverCode]);

  const fetchOrder = async (orderType: any, code: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/driver/validate?type=${orderType}&code=${code}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order details.");
      }
      const data = await response.json();
      setOrder(data);
      setStatus(data.status || "");
      setNotes(data.notes || "");
      setCurrency(data.currencySign || "");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/driver/update?type=${type}&code=${driverCode}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, notes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order.");
      }

      toast.success("Order updated successfully!");
      fetchOrder(type, driverCode); // Refresh order details
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order found.</p>
      </div>
    );
  }

  const renderDetails = () => {
    if (type === "DELIVERY_ORDER") {
      return (
        <div>
          <p className="text-sm text-gray-600">Store: {order.storeName}</p>
          <p className="text-sm text-gray-600">Products:</p>
          <ul className="list-disc ml-5 text-sm text-gray-600">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item: any) => (
                <li key={item.id}>
                  {item.quantity}x {item.productTitle} ({currency} {item.price.toFixed(2)})
                </li>
              ))
            ) : (
              <li>No products available.</li>
            )}
          </ul>
        </div>
      );
    } else if (type === "SERVICE_ORDER") {
      return (
        <div>
          <p className="text-sm text-gray-600">Service: {order.serviceName}</p>
        </div>
      );
    }
    return null;
  };

  const allowedStatuses =
    type === "DELIVERY_ORDER"
      ? ["ON_WAY", "COMPLETED"] // Delivery-specific statuses
      : ["IN_PROGRESS", "COMPLETED"]; // Service-specific statuses

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Order #{order.id} ({type.replace("_", " ")})
        </h1>

        {renderDetails()}

        <label className="block text-gray-700 font-medium mb-2 mt-4">
          Update Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>Select Status</option>
          {allowedStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>


        <label className="block text-gray-700 font-medium mt-4 mb-2">
          Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full"
          rows={4}
        />

        <Button
          onClick={handleUpdate}
          className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Update Order
        </Button>
      </div>
    </div>
  );
};

export default DriverPage;
