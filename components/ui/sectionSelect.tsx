"use client";

import React, { useEffect, useState, memo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchFromNest } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

interface Section {
  id: number;
  name: string;
name_ar: string;
}

interface SectionSelectProps {
  /** Currently selected section ID (if any). */
  value: number | null;
  /** Callback to notify parent when selection changes. */
  onChange: (sectionId: number | null) => void;
}

export const SectionSelect: React.FC<SectionSelectProps> = memo(
  ({ value, onChange }) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t,language } = useLanguage()

    // Fetch all global sections once
    useEffect(() => {
      const fetchSections = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Example: GET /admin/sections
          const data = await fetchFromNest("/admin/stores/sections");
          setSections(data);
        } catch (err) {
          setError("Could not load sections.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSections();
    }, []);

    // Handle user selection
    const handleSelect = (sectionIdString: string) => {
      const sectionId = sectionIdString ? Number(sectionIdString) : null;
      onChange(sectionId);
    };

    // Current selected value as a string
    const currentValue = value ? String(value) : "";

    return (
      <div className="space-y-1">
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}
        {isLoading && (
          <p className="text-gray-500 text-sm">
            {t("common.loading")}
          </p>
        )}

        <Select
          value={currentValue}
          onValueChange={handleSelect}
          disabled={isLoading || !!error}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("store.header.section")} />
          </SelectTrigger>
          <SelectContent>
            {/* Allow clearing the selection */}
            <SelectItem value="">{t("common.none")}</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={String(section.id)}>
                {language == "ar" ? section.name_ar : section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

SectionSelect.displayName = "SectionSelect";
