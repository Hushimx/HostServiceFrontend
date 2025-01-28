import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher: React.FC = () => {
    const { setLanguage, language } = useLanguage();

    return (
        <div>
            <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 ${language === "en" ? "font-bold" : ""}`}
            >
                English
            </button>
            <button
                onClick={() => setLanguage("ar")}
                className={`px-4 py-2 ${language === "ar" ? "font-bold" : ""}`}
            >
                العربية
            </button>
        </div>
    );
};

export default LanguageSwitcher;
