import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-queryParams";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterColumn {
  id: string;
  type: "input" | "select"; // Add type to differentiate
  options?: { label?: string; value: string }[];
  label?: string;
}

interface FilterPopoverProps {
  filterColumns: FilterColumn[];
  isApplyingFilters: boolean;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  filterColumns,
  isApplyingFilters,
}) => {
  const { getQueryParams, updateQueryParams, clearQueryParams } =
  useQueryParams();
  const { t,language } = useLanguage()
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(
    getQueryParams() || {}
  );
  const handleInputChange = (columnId: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleSelectChange = (columnId: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleApply = () => {
    updateQueryParams(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    // clearQueryParams(filterColumns.map((col) => col.id));
    clearQueryParams(Object.keys(getQueryParams()));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <span className="w-5 h-5 text-center rounded-full bg-purple-700 p-3 flex justify-center items-center text-white absolute -top-4 right-0">{Object.keys(getQueryParams()).length}</span>
        <Button variant="outline">{t("filters.trigger")}</Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-h-96 overflow-y-auto w-80 " style={{direction: `${language === 'ar' ? 'rtl' : 'ltr'}`}}>
        <div className="p-4">
          {filterColumns.map(({ id: columnId,label, type, options }) => (
            <div key={columnId} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("filters.filterBy")} {label || columnId}
              </label>
              {type === "select" && options ? (
                <Select
                  onValueChange={(value) => handleSelectChange(columnId, value)}
                  value={localFilters[columnId] || ""}
                >
                  <SelectTrigger>
                    {localFilters[columnId]
                      ? options.find(
                          (option) => option.value === localFilters[columnId]
                        )?.label || `Select ${columnId}`
                      : `Select ${columnId}`}
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={` ${label || columnId}`}
                  value={localFilters[columnId] || ""}
                  onChange={(e) =>
                    handleInputChange(columnId, e.target.value)
                  }
                />
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handleReset}>
              {t("filters.reset")}
            </Button>
            <Button size="sm" onClick={handleApply} disabled={isApplyingFilters}>
              {isApplyingFilters ? t("filters.applying") : t("filters.apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
