"use client";

import { useEffect } from "react";
import { useLanguage } from '@/contexts/LanguageContext'
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"; // Using Heroicons

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useLanguage(); // Access translations using the language provider

  useEffect(() => {
    console.error("Error caught by error.tsx:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Heroicons Exclamation Circle Icon */}
      <ExclamationCircleIcon height={100} className="text-8xl text-blue-500 mb-6" />

      {/* Error Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        {t("error_title") || "Oops! Something went wrong."}
      </h1>

      {/* Error Message */}
      <p className="text-gray-600 mt-2 text-center">
        {error.message || t("errors.somethingWentWrong")}
      </p>

      {/* Retry Button */}
      <button
        onClick={reset}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        {t("retry_button") || "Retry"}
      </button>

      {/* Back to Home Link */}
      <a
        href="/client/home"
        className="mt-4 text-blue-700 underline hover:text-blue-900"
      >
        {t("go_home") || "Go back to Home"}
      </a>
    </div>
  );
}
