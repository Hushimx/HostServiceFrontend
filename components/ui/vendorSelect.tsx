"use client";

import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { fetchFromNest } from "@/hooks/useFetch";
import { t, T } from "@faker-js/faker/dist/airline-C5Qwd7_q";
import { useLanguage } from "@/contexts/LanguageContext";

interface Vendor {
  id: number;
  name: string;
}

interface VendorSelectProps {
  city: number | null; // City ID to fetch vendors
  value: number | null; // Currently selected vendor ID
  onSelect: (vendorId: number | null) => void; // Callback when a vendor is selected
}

export const VendorSelect: React.FC<VendorSelectProps> = ({
  city,
  value,
  onSelect,
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  // Fetch vendors when the city changes
  useEffect(() => {
    if (!city) {
      setVendors([]);
      setFilteredVendors([]);
      return;
    }

    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFromNest(
          `/admin/vendors?city=${city}&limit=0`
        );
        const vendorData = response.data || [];
        setVendors(vendorData);
        setFilteredVendors(vendorData); // Initially, filtered = all vendors
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setError("Failed to fetch vendors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [city]);

  // Update filtered vendors when searchQuery changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(query)
    );
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  return (
    <div className="min-w-14 max-w-max">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-transparent"
              disabled={!city}
            >
              {value
                ? vendors.find((vendor) => vendor.id === value)?.name || t("vendors.selector.select")
                : t("vendors.selector.select")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            {/* Search Input */}
            <div className="p-2">
              <Input
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Dropdown Items */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-2 text-sm text-gray-500">{t("common.loading")}</div>
              ) : filteredVendors.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">{t("vendors.selector.noVendors")}</div>
              ) : (
                filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`flex items-center justify-between px-2 py-1 cursor-pointer ${
                      value === vendor.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => {
                      onSelect(vendor.id);
                      setOpen(false);
                    }}
                  >
                    {vendor.name}
                    {value === vendor.id && <Check className="h-4 w-4" />}
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
