"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import PageContainer from "@/components/layout/page-container";
import { toast } from "sonner";
import withPermission from "@/components/providers/withRoles";
import { Permission } from "@/lib/rbac";
import { useLanguage } from "@/contexts/LanguageContext";

// Enum for Order Status
enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
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
  serviceName: string;
  vendorName: string;
  currencySign: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

const Order: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { t } = useLanguage();
  // Fetch order details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await fetchFromNest(`/vendor/orders/service/${orderId}`);


        setOrder(data);
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

  if (loading) return <Loading message="Fetching order details..." />;
  if (error) return <Error message={error} onRetry={() => location.reload()} />;

  return (
    <PageContainer>
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-md shadow-lg dark:bg-gray-800 dark:text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">{t("orders.info.details")} #{order?.id}</h1>

        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-base">
          {[
    { label: t("orders.info.clientNumber"), value: order?.clientNumber },
    { label: t("orders.info.serviceName") || "اسم الخدمة", value: order?.serviceName }, // Add this key to translations if not present
    { label: t("orders.info.hotelName"), value: order?.hotelName },
    { label: t("orders.info.roomNumber"), value: order?.roomNumber },
    { label: t("orders.info.notes"), value: order?.notes || t("orders.info.noNotes") },
    { label: t("orders.info.total"), value: `${order?.currencySign} ${order?.total.toFixed(2)}` },
    { label: t("orders.info.date") || "تاريخ الإنشاء", value: new Date(order?.createdAt).toLocaleString() }, // Ensure key exists in translations
    { label: t("orders.info.updatedAt") || "تاريخ التحديث", value: new Date(order?.updatedAt).toLocaleString() }, // Add this key to translations if not present
].map(({ label, value }) => (
            <div key={label}>
              <p className="font-semibold text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-lg">{value}</p>
            </div>
          ))}


        </div>


      </div>
    </PageContainer>
  );
};

export default Order;
