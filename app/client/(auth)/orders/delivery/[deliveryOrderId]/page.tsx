"use client";

import React, { useEffect, useState } from "react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import NotFound from "@/app/not-found";

const OrderDetailsPage = ({ orderId }: { orderId: string }) => {
  const { t } = useLanguage();
  const statusSteps = [
    { id: 1, name: t("status.PENDING"), key: "PENDING" },
    { id: 2, name: t("status.PICKUP"), key: "PICKUP" },
    { id: 3, name: t("status.ON_WAY"), key: "ON_WAY" },
    { id: 4, name: t("status.COMPLETED"), key: "COMPLETED" },
  ];

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useClientAuth();
  const { deliveryOrderId } = useParams();

  // Fetch order data from the backend
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${deliveryOrderId}`, {
          headers: {
            authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError(t("orders.error.notFound"));
          } else {
            setError(t("orders.error.serverError"));
          }
        } else {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        setError(t("orders.error.serverError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, t, user?.token, deliveryOrderId]);

  const getStepStyle = (stepKey: string) => {
    const currentIndex = statusSteps.findIndex((s) => s.key === order?.status);
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);

    if (stepIndex < currentIndex) return "bg-green-500 text-white border-green-500";
    if (stepIndex === currentIndex) return "bg-yellow-400 text-white border-yellow-400";
    return "bg-gray-300 text-gray-500 border-gray-300";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!order) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-purple-700 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">{t("orders.info.details")}</h1>
      </div>
      {order?.status === "CANCELED" ? (
        <div className="flex justify-between items-center mb-8 bg-red-500 text-white p-4 rounded-lg shadow-md">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          <h1 className="text-2xl font-bold">{t("orders.info.canceled")}</h1>
        </div>
      ) : (
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
      )}
      {/* Order Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("orders.info.details")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>{t("orders.info.id")}:</strong> {order.id}
          </p>
          <p>
            <strong>{t("orders.info.date")}:</strong> {new Date(order.date).toLocaleDateString()}
          </p>
          <p>
            <strong>{t("orders.info.clientName")}:</strong> {order.client.name}
          </p>
          <p>
            <strong>{t("orders.info.clientNumber")}:</strong> {order.client.phoneNumber}
          </p>
          <p>
            <strong>{t("orders.info.hotelName")}:</strong> {order.hotel.name}
          </p>
          <p>
            <strong>{t("orders.info.roomNumber")}:</strong> {order.room.name}
          </p>
          <p>
            <strong>{t("orders.info.paymentMethod")}:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>{t("orders.info.notes")}:</strong> {order.notes || t("orders.info.noNotes")}
          </p>
        </div>
      </div>
      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("orders.info.products")}</h2>
        <div className="divide-y divide-gray-200">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center py-3">
              <p className="text-gray-700 sm:bg-red-500  ">
                {item.name}{" "}
                <span className="text-gray-500">
                  ({item.quantity} × {item.price}
                  {order.currencySign})
                </span>
              </p>
              <p className="font-semibold text-gray-800">
                {(item.quantity * item.price).toFixed(2)}
                {order.currencySign}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Order Total */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md text-black font-semibold">
        <span className="text-lg">{t("orders.info.total")}</span>
        <span className="text-lg">{order.currencySign} {order.total}</span>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
