"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext"; // Context for translations
import { useIsMobile } from "@/hooks/use-mobile"; // Hook to detect mobile devices
import Head from "next/head";
import { fetchFromNest } from "@/hooks/useFetch";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useRouter } from "next/navigation"; // For navigation

// Enums for statuses
const DeliveryOrderStatus = {
  PENDING: "PENDING",
  PICKUP: "PICKUP",
  ON_WAY: "ON_WAY",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

const ServiceOrderStatus = {
  PENDING: "PENDING",
  PICKUP: "PICKUP",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

const OrdersPage = () => {
  const { t } = useLanguage(); // Translation hook
  const isMobile = useIsMobile(); // Check if the user is on a mobile device
  const { user } = useClientAuth();
  const router = useRouter();

  const [orders, setOrders] = useState({
    deliveryOrders: [],
    serviceOrders: [],
    bookings: [],
  });
  const [selectedTab, setSelectedTab] = useState("deliveryOrders");
  const [loading, setLoading] = useState(false);

  const tabs = ["deliveryOrders", "serviceOrders"];

  // Fetch delivery orders
  const fetchDeliveryOrders = async () => {
    setLoading(true);
    try {
      const token = user.token;
      const data = await fetchFromNest("/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const deliveryOrders = data.map((order) => ({
        id: order.id,
        name: order.storeName,
        price: order.total,
        date: new Date(order.createdAt).toLocaleString(),
        currency: order.currency,
        status: order.status,
      }));
      setOrders((prev) => ({ ...prev, deliveryOrders }));
    } catch (error) {
      console.error(t("errors.fetch"), error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service orders
  const fetchServiceOrders = async () => {
    setLoading(true);
    try {
      const token = user.token;
      const data = await fetchFromNest("/service/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const serviceOrders = data.map((order) => ({
        id: order.id,
        name: order.service.name,
        notes: order.notes,
        price: order.total,
        date: new Date(order.createdAt).toLocaleString(),
        status: order.status,
      }));
      setOrders((prev) => ({ ...prev, serviceOrders }));
    } catch (error) {
      console.error(t("errors.fetch"), error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on selected tab
  useEffect(() => {
    if (selectedTab === "deliveryOrders") fetchDeliveryOrders();
    if (selectedTab === "serviceOrders") fetchServiceOrders();
  }, [selectedTab]);

  const filteredOrders = orders[selectedTab];

  // Handle order click
  const handleOrderClick = (id, type) => {
    if (type === "delivery") {
      router.push(`/client/orders/delivery/${id}`);
    } else if (type === "service") {
      router.push(`/client/orders/service/${id}`);
    }
  };

  const getStatusColor = (status, type) => {
    const isCompleted =
      status === DeliveryOrderStatus.COMPLETED ||
      status === ServiceOrderStatus.COMPLETED;
    const isCanceled =
      status === DeliveryOrderStatus.CANCELED ||
      status === ServiceOrderStatus.CANCELED;
    const isInProgress =
      status === DeliveryOrderStatus.ON_WAY ||
      status === ServiceOrderStatus.IN_PROGRESS;

    if (isCompleted) return "bg-green-500";
    if (isCanceled) return "bg-red-500";
    if (isInProgress) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="p-4 max-w-full min-h-screen bg-gray-50">
      <Head>
        <title>{t("orders.page_title") || "My Orders"}</title>
      </Head>

      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-purple-600">{t("orders.page_title") || "My Orders"}</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium shadow-md transition-colors duration-300 ${
              selectedTab === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t(`orders.${tab}`) || tab} {/* Render translation or fallback to tab key */}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg font-medium">
          {t("common.loading") || "Loading..."}
        </p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <img
            src="/assets/icons/no-order.png"
            alt="No orders yet"
            className="w-32 h-32 mx-auto mb-4"
          />
          <p className="text-lg font-medium">{ "No orders yet."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              onClick={() =>
                handleOrderClick(
                  order.id,
                  selectedTab === "deliveryOrders" ? "delivery" : "service"
                )
              }
              className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {order.name}
                </h3>
                {order.notes && (
                  <p className="text-sm text-gray-500 mb-1">{order.notes}</p>
                )}
                <p className="text-sm text-gray-400">{order.date}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {order.price} {order.currency || "SAR"}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-medium text-white ${getStatusColor(
                    order.status,
                    selectedTab
                  )}`}
                >
                  {t(`status.${order.status}`) || order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
