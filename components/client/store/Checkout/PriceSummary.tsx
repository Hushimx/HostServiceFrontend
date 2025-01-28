"use client";

import { useState, useEffect } from "react";

const PriceSummary = ({ total }: { total: number }) => {
  const [fees, setFees] = useState({
    delivery: 0,
    tax: 0,
  });

  useEffect(() => {
    // Fetch delivery fees and taxes dynamically
    const fetchFees = async () => {
      const response = await fetch("/api/fees");
      const data = await response.json();
      setFees({
        delivery: data.deliveryFee || 15.5,
        tax: data.tax || 2.33,
      });
    };

    fetchFees();
  }, []);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-yellow-800 mb-4">ملخص الدفع</h2>
      <ul className="space-y-3 text-gray-700">
        <li className="flex justify-between">
          <span>رسوم التوصيل</span>
          <span>{fees.delivery.toFixed(2)} ريال</span>
        </li>
        <li className="flex justify-between">
          <span>ضريبة القيمة المضافة</span>
          <span>{fees.tax.toFixed(2)} ريال</span>
        </li>
        <li className="flex justify-between font-semibold text-gray-900">
          <span>المجموع شامل الضريبة</span>
          <span>{(total + fees.delivery + fees.tax).toFixed(2)} ريال</span>
        </li>
      </ul>
    </div>
  );
};

export default PriceSummary;
