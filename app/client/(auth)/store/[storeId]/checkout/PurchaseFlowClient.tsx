"use client";

import { useState, useEffect } from "react";
import DeliveryDetails from "@/components/client/store/Checkout/DeliveryDetails";
import PaymentMethods from "@/components/client/store/Checkout/PaymentMethods";
import CheckoutCart from "@/components/client/store/Checkout/CheckoutCart";
import SuccessDrawer from "@/components/client/store/Checkout/success";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResponsiveDialog from "@/components/responsiveDialog";
import { XCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { UUID } from "crypto";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useRouter } from "next/navigation";

const CheckoutPage = ({ storeId }: { storeId: UUID }) => {
  const { setStore, cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useClientAuth();
  const currency = user?.currencySign || "$";

  useEffect(() => {
    setStore(`${user.hotelName}-${storeId}`, storeId);
  }, [storeId, setStore]);

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    setIsError(false); // Reset error state

    const orderData = {
      store: `${storeId}`,
      paymentMethod: selectedPayment,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.orderId);
        setIsOrderSuccess(true);
        clearCart();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || t("errors.unknown"));
        setIsError(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage(t("errors.somethingWentWrong"));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white opacity-90 flex justify-center items-center z-50">
        <div className="animate-spin w-16 h-16 border-4 rounded-full border-purple-500 border-t-transparent"></div>
        <p className="ml-4 text-lg text-gray-800">{t("checkout.loading")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 relative">
      <h1 className="text-3xl font-bold text-purple-600">{t("checkout.title")}</h1>

      {cart.length > 0 ? (
        <>
          {/* <DeliveryDetails /> */}
          <CheckoutCart
            cart={cart}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
          />
          <PaymentMethods
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />

          <div className="p-4 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-2">{t("checkout.total")}</h2>
            <p className="text-xl font-bold text-purple-600">
              {currency}
              {total.toFixed(2)}
            </p>
            <Button
              className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
              onClick={handleConfirmOrder}
              disabled={selectedPayment === ""}
            >
              {t("checkout.confirmPurchase")}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="mb-4 text-purple-600">
            <ShoppingCartIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t("checkout.emptyCart")}</h2>
          <p className="text-gray-600">{t("checkout.addItemsToContinue")}</p>
          <Link href="/store">
            <Button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              onClick={() => router.back()}
            >
              {t("checkout.goBack")}
            </Button>
          </Link>
        </div>
      )}

      {/* Success Drawer */}
      <SuccessDrawer
        isOpen={isOrderSuccess}
        onClose={() => setIsOrderSuccess(false)}
        button={
          <Link href={`/client/orders/delivery/${orderId}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 rounded-lg">
              {t("checkout.viewOrder")}
            </Button>
          </Link>
        }
      />

      {/* Error Drawer */}
      <ResponsiveDialog
        title={t("checkout.errorTitle")}
        description={errorMessage}
        open={isError}
        setOpen={setIsError}
      >
        <div className="text-center p-4 flex flex-col items-center">
          <XCircleIcon className="w-12 h-12 text-red-500" />
          <p className="text-gray-700">{errorMessage}</p>
          <Button
            onClick={() => setIsError(false)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            {t("checkout.close")}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default CheckoutPage;
