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

interface FilterColumn {
  id: string;
  type: "input" | "select"; // Add type to differentiate
  options?: { label: string; value: string }[];
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
    clearQueryParams(filterColumns.map((col) => col.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter</Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-96 overflow-y-auto w-80">
        <div className="p-4">
          {filterColumns.map(({ id: columnId,label, type, options }) => (
            <div key={columnId} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Filter by {label || columnId}
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
                  placeholder={`Enter ${label || columnId}`}
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
              Reset
            </Button>
            <Button size="sm" onClick={handleApply} disabled={isApplyingFilters}>
              {isApplyingFilters ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
