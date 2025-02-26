"use client";

import React, { useState, useEffect } from "react";
import SuccessDrawer from "@/components/client/store/Checkout/success";
import { useLanguage } from "@/contexts/LanguageContext";
import Error from "@/components/ui/error";
import NotFound from "@/app/not-found";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";

export default function ServicePage({ slug }: { slug: string }) {
  const [service, setService] = useState<{
    serviceName: string;
    serviceNameAr: string;
    description: string;
    vendor: {
      description: string;
      description_ar: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { t, language } = useLanguage();

  // Fetch service details
  const fetchService = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/${slug}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData?.code, t("services.error_generic"));
        return;
      }

      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("service.error_fetch_service"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle errors based on error codes
  const handleError = (code: string | undefined, fallbackMessage: string) => {
    const errorKey = `errors.${code}`;
    setErrorMessage(code ? t(errorKey) : fallbackMessage);
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ slug, notes }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData?.code, t("services.error_generic"));
        return;
      }
      console.log(await response.json())
      setIsOrderSuccess(true);
    } catch (error) {
      setErrorMessage(t("service.error_unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [slug]);

  // Render loading state
  if (isLoading) {
    return <Loading />;
  }
  // Render not found page
  if (errorMessage == "404") {
    return <NotFound />;
  }

  // Render error state
  
  // Render service not found state
  if (!service && !isLoading) {
    return <NotFound />;
  }
  if (errorMessage && !isLoading) {
    return <Error message={errorMessage} onRetry={fetchService} />;
  }


  // Determine description to display
  const displayDescription =
    language === "ar" && service.vendor.description_ar
      ? service.vendor.description_ar
      : service.vendor.description;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mt-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
          {language === "ar" && service.serviceNameAr
            ? service.serviceNameAr
            : service.serviceName}
        </h1>
        {/* Apply Quill styles */}
        <div className="ql-editor text-sm text-gray-800 mt-4">
          <div dangerouslySetInnerHTML={{ __html: displayDescription }} />
        </div>
        <div className="mt-8 text-center">
          <Textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("services.notes_placeholder")}
            className="w-full  p-3 border rounded-lg text-sm focus:outline-none mb-5"
          />
          <button
            onClick={handleConfirmOrder}
            className="px-6 py-3 w-full bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {t("services.order_now")}
          </button>
        </div>
      </div>

      {/* Success Drawer */}
      <SuccessDrawer isOpen={isOrderSuccess} onClose={() => setIsOrderSuccess(false)} 
        button={
          <Link href={`/client/orders/service/${orderId}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 rounded-lg">
              {t("checkout.viewOrder")}
            </Button>
          </Link>
        }
        />
    </div>
  );
}
