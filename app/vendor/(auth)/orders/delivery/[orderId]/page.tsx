"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import PageContainer from "@/components/layout/page-container";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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
  currencySign: string;
  orderItems: OrderItem[];
}

const Order: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { t } = useLanguage();
  // Fetch order details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await fetchFromNest(`/vendor/orders/delivery/${orderId}`);
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
      await fetchFromNest(`/vendor/orders/${orderId}`, {
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

  if (loading) return <Loading message="Fetching order details..." />;
  if (error) return <Error message={error} onRetry={() => location.reload()} />;

  return (
<PageContainer>
  <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-md shadow-lg dark:bg-gray-800 dark:text-gray-200">
    {/* Header */}
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h1 className="text-3xl font-bold">{t("orders.info.details")} #{order?.id}</h1>
      <button
        onClick={() => router.push("/orders")}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        {t("orders.info.backToOrders")}
      </button>
    </div>

    {/* Order Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-base">
      {[
        { label: t("orders.info.clientNumber"), value: order?.clientNumber },
        { label: t("orders.info.paymentMethod"), value: order?.paymentMethod },
        { label: t("orders.info.total"), value: `${order?.currencySign} ${order?.total.toFixed(2)}` },
        { label: t("orders.info.date"), value: new Date(order?.createdAt).toLocaleString() },
        { label: t("orders.info.updatedAt"), value: new Date(order?.updatedAt).toLocaleString() },
        { label: t("orders.info.notes"), value: order?.notes || t("orders.info.noNotes") },
      ].map(({ label, value }) => (
        <div key={label}>
          <p className="font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg">{value}</p>
        </div>
      ))}

      {/* Status Dropdown */}
      <div>
        <p className="font-semibold text-gray-500 dark:text-gray-400">{t("common.status")}</p>
          {t("status." + status)}
      </div>
    </div>

    {/* Product Table */}
    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-300">
      {t("orders.info.products")}
    </h2>
    <table className="w-full text-base border-collapse border dark:border-gray-700">
      <thead className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
        <tr>
          <th className="p-4 text-left border dark:border-gray-600">{t("orders.info.product")}</th>
          <th className="p-4 text-left border dark:border-gray-600">{t("orders.info.quantity")}</th>
          <th className="p-4 text-left border dark:border-gray-600">{t("orders.info.price")}</th>
          <th className="p-4 text-left border dark:border-gray-600">{t("orders.info.total")}</th>
        </tr>
      </thead>
      <tbody>
        {order?.orderItems.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 border dark:border-gray-600">{item.productTitle}</td>
            <td className="p-4 border dark:border-gray-600">{item.quantity}</td>
            <td className="p-4 border dark:border-gray-600">
              {order?.currencySign} {item.price.toFixed(2)}
            </td>
            <td className="p-4 border dark:border-gray-600">
              {order?.currencySign} {item.totalPrice.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</PageContainer>

  );
};

export default Order;
