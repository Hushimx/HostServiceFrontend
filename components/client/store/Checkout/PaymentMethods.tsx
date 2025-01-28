"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const paymentMethods = [
  { id: "Cash", label: "cash_on_delivery" },
];

export default function PaymentMethods({selectedPayment, setSelectedPayment}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t("select_payment_method")}</h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              selectedPayment === method.id
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="text-gray-800 font-medium">{t("payments."+method.label)}</span>
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedPayment === method.id}
              onChange={() => setSelectedPayment(method.id)}
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
