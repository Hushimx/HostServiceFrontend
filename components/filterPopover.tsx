import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"; // Replace with your Select imports

interface FilterColumn {
  id: string;
  options?: { label: string; value: string }[]; // Options for dropdown
}

interface FilterPopoverProps {
  filterColumns: FilterColumn[];
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isApplyingFilters: boolean;
  onApply: () => void;
  onReset: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  filterColumns,
  filters,
  setFilters,
  isApplyingFilters,
  onApply,
  onReset,
}) => {
  const handleInputChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleSelectChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter</Button>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={(event) => {
          // Prevent popover dismissal if the click is within the Select component
          if (
            event.target &&
            (event.target as HTMLElement).closest(".select-component")
          ) {
            event.preventDefault();
          }
        }}
      >
        <div className="p-4">
          {filterColumns.map(({ id: columnId, options }) => (
            <div key={columnId} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Filter by {columnId}
              </label>
              {options && options.length > 0 ? (
                // Dropdown for predefined options
                <div className="select-component">
                  <Select
                    onValueChange={(value) => handleSelectChange(columnId, value)}
                  >
                    <SelectTrigger>
                      {filters[columnId]
                        ? options.find((option) => option.value === filters[columnId])
                            ?.label || `Select ${columnId}`
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
                </div>
              ) : (
                // Text input for free text
                <Input
                  placeholder={`Enter ${columnId}`}
                  value={filters[columnId] || ""}
                  onChange={(e) => handleInputChange(columnId, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={onReset}>
              Reset
            </Button>
            <Button size="sm" onClick={onApply} disabled={isApplyingFilters}>
              {isApplyingFilters ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
