"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import PageContainer from "@/components/layout/page-container";
import { toast } from "sonner";

// Enum for Order Status
enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

// Types
interface OrderItem {
  id: number;
  productTitle: string;
  vendorId: number;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderDetails {
  id: number;
  clientName: string;
  clientNumber: string;
  deliveryAddress: string;
  hotelName: string;
  roomNumber: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

const EditAdminPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);

  // Fetch order details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await fetchFromNest(`/admin/orders/${orderId}`);
        const enrichedItems = data.orderItems.map((item: any) => ({
          ...item,
          totalPrice: item.quantity * item.price,
        }));

        setOrder({ ...data, orderItems: enrichedItems });
        setStatus(data.status);
      } catch (err: any) {
        console.error(err);
        setError(err.status === 404 ? "Order not found." : "Failed to fetch order data.");
        toast.error("Failed to fetch order data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [orderId]);

  // Handle status change
  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await fetchFromNest(`/admin/orders/${orderId}`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setStatus(newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success("Order status updated successfully.");
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  // Handle delete order
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }
    try {
      await fetchFromNest(`/admin/orders/${orderId}`,{
        method: "DELETE",
      });
      toast.success("Order deleted successfully.");
      router.push("/orders"); // Redirect to orders list
    } catch {
      toast.error("Failed to delete the order.");
    }
  };

  if (loading) return <Loading message="Fetching order details..." />;
  if (error) return <Error message={error} onRetry={() => location.reload()} />;

  return (
    <PageContainer>
      <div className="w-full p-8 mx-auto shadow-lg rounded-md border bg-card text-card-foreground shadow-lg dark:bg-gray-800 dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-primary dark:text-blue-400">
            Order #{order?.id}
          </h1>
          <div className="space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete Order
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-base">
          {[
            { label: "Client Name", value: order?.clientName },
            { label: "Client Number", value: order?.clientNumber },
            { label: "Delivery Address", value: order?.deliveryAddress },
            { label: "Hotel Name", value: order?.hotelName },
            { label: "Room Number", value: order?.roomNumber },
            { label: "Payment Method", value: order?.paymentMethod },
            { label: "Notes", value: order?.notes || "No additional notes" },
            { label: "Total", value: `$${order?.total.toFixed(2)}` },
            { label: "Created At", value: new Date(order?.createdAt).toLocaleString() },
            { label: "Updated At", value: new Date(order?.updatedAt).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-semibold text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-lg">{value}</p>
            </div>
          ))}

          {/* Status Dropdown */}
          <div>
            <p className="font-semibold text-gray-500 dark:text-gray-400">Status</p>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Table */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-300">
          Order Items
        </h2>
        <table className="w-full text-base border-collapse border dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left border dark:border-gray-600">Product</th>
              <th className="p-4 text-left border dark:border-gray-600">Quantity</th>
              <th className="p-4 text-left border dark:border-gray-600">Price</th>
              <th className="p-4 text-left border dark:border-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 border dark:border-gray-600">{item.productTitle}</td>
                <td className="p-4 border dark:border-gray-600">{item.quantity}</td>
                <td className="p-4 border dark:border-gray-600">${item.price.toFixed(2)}</td>
                <td className="p-4 border dark:border-gray-600">${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default EditAdminPage;
