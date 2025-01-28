"use client";

import { CartItem } from "@/types/store";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/contexts/ClientAuthContext";

interface CartContentProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export default function CartContent({
  cart,
  total,
  onUpdateQuantity,
  onRemoveFromCart,
}: CartContentProps) {
  const { t } = useLanguage();
  const { user } = useClientAuth(); // Access user context for currency
  const currency = user?.currencySign; // Default to USD if no currency is provided
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">{t("your_cart")}</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <FaceFrownIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium">{t("your_cart_is_empty")}</p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                {/* Product Image */}
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                {/* Product Details */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{t("price")}: { currency } {item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="text-gray-600 bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-medium m-0">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="text-gray-600 bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 bg-gray-100 px-3 py-1 rounded-lg ml-4"
                >
                  {t("remove")}
                </button>
              </li>
            ))}
          </ul>

          {/* Total Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{t("total")}</h2>
              <p className="text-lg font-bold text-purple-600">{currency} {total.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
