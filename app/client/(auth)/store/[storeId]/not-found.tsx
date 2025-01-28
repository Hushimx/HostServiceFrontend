// pages/404.tsx

"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext"; // Adjust the path based on your project structure

export default function NotFoundPage() {
  const { t } = useLanguage(); // Access translations using the language provider

  useEffect(() => {
    document.title = t("page_not_found_title"); // Set dynamic title
  }, [t]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      {/* Error Icon */}
      <div style={{ fontSize: "80px", color: "red" }}>
        &#128531; {/* You can replace this with any custom icon */}
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "48px", color: "gray" }}>
        {t("NotFound_title") || "404"} {/* Translate the error title */}
      </h1>

      {/* Error Message */}
      <p style={{ fontSize: "24px", color: "gray" }}>
        {t("NotFound_message") || "Oops! The page you are looking for doesn't exist."}
      </p>

      {/* Back to Home Link */}
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        {t("go_home") || "Go back to Home"}
      </a>
    </div>
  );
}
