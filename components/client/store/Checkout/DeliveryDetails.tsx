"use client";

import { useState, useEffect } from "react";

const DeliveryDetails = ({ storeName }: { storeName: string }) => {
  const [deliveryTime, setDeliveryTime] = useState("");

//   useEffect(() => {
//     // Fetch delivery time dynamically based on the store
//     const fetchDeliveryTime = async () => {
//       const response = await fetch(`/api/stores/${storeName}/delivery-time`);
//       const data = await response.json();
//       setDeliveryTime(data.deliveryTime || "20-30 دقائق");
//     };

//     fetchDeliveryTime();
//   }, [storeName]);

  return (
    <div className="p-4 bg-yellow-50 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-yellow-800 mb-2">تفاصيل التوصيل</h2>
      <div className="flex items-center justify-between text-gray-600">
        <span className="text-sm">مدة التوصيل المتوقعة</span>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">{deliveryTime}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6l4 2m-4-14a10 10 0 1010 10A10 10 0 0012 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
