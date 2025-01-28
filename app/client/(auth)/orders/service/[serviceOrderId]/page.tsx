"use client";

import React, { useEffect, useState } from "react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useParams } from "next/navigation";
import { create } from 'zustand';
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceOrderDetailsPage = ({ orderId }: { orderId: string }) => {
  const statusSteps = [
    { id: 1, name: "جديد", key: "PENDING" },
    { id: 2, name: "قيد التنفيذ", key: "IN_PROGRESS" },
    { id: 3, name: "مكتمل", key: "COMPLETED" },
  ];

  // State
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useClientAuth();
  const { serviceOrderId } = useParams(); // Get the service order ID from the URL
  const { t } = useLanguage()
  // Fetch order data from the backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/service/orders/${serviceOrderId}`,
          {
            headers: {
              authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("404 - لم يتم العثور على الطلب");
          } else {
            setError("500 - خطأ في الخادم");
          }
        } else {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        setError("500 - خطأ في الخادم");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [serviceOrderId]);

  const getStepStyle = (stepKey: string) => {
    const currentIndex = statusSteps.findIndex((s) => s.key === order?.status);
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);

    if (stepIndex < currentIndex) return "bg-green-500 text-white border-green-500";
    if (stepIndex === currentIndex) return "bg-yellow-400 text-white border-yellow-400";
    return "bg-gray-300 text-gray-500 border-gray-300";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">{t("common.loading")}</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-2xl font-semibold">{error}</p>
      </div>
    );
  }

  // Page not found state
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-gray-500 mb-4" />
        <p className="text-2xl font-semibold">{t("errors.404_page_not_found")}</p>
      </div>
    );
  }

  // Render Service Order Details
  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-purple-700 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">{t("orders.info.service_request_details")}</h1>
      </div>
      {(order?.status === "CANCELED") ? (
        <div className="flex justify-between items-center mb-8 bg-red-500 text-white p-4 rounded-lg shadow-md">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          <h1 className="text-2xl font-bold">{t("orders.info.order_cancelled")}</h1>
        </div>
      ) : 
      /* Roadmap Stepper */
      <div className="flex items-center justify-between relative mb-8">
        {statusSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center w-full relative">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold border-2 shadow-md ${getStepStyle(
                  step.key
                )}`}
              >
                {index < statusSteps.findIndex((s) => s.key === order.status) ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="mt-2 text-[12px] font-semibold text-gray-600">{step.name}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      }
      {/* Order Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("orders.card.order_number")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>{t("orders.card.order_number")}</strong> {order.id}</p>
          <p><strong>{t("orders.card.service")}</strong> {order.service.name}</p>
          <p><strong>{t("orders.card.date")}</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>{t("orders.card.client")}</strong> {order.clientName}</p>
          <p><strong>{t("orders.card.phone")}</strong> {order.clientNumber}</p>
          <p><strong>{t("orders.card.note")}</strong> {order.notes || t("orders.info.noNotes")}</p>
        </div>
      </div>

      {/* Order Total */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md text-black font-semibold">
        <span className="text-lg">s</span>
        <span className="text-lg">{order.currencySign} {order.total}</span>
      </div>
    </div>
  );
};

export default ServiceOrderDetailsPage;
