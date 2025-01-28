"use client";

import React, { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useSearchParams } from "next/navigation";
import fetchDataTable from "@/lib/fetchDataTable";
import { Pagination } from "@/components/pagination";
import { getStoreColumns } from "./tables/columns"; // <-- You will create this
import { DataTable } from "@/components/ui/table/data-table";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/use-queryParams";
import { FilterPopover } from "@/components/filterPopover";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import { SectionSelect } from "@/components/ui/sectionSelect";

/** 
 * Example filter columns for your FilterPopover. 
 * Adjust as needed to match your store fields (e.g., "ownerId", "approved", etc.).
 */
const filterColumns = [
  { id: "name" },
];

export default function StoresListingPage() {
  // Grab query params from the URL
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("common.name");
  const section = searchParams.get("section");
  const country = searchParams.get("country");
  const city = searchParams.get("city");
  const approved = searchParams.get("approved");

  // Hooks and State
  const { t } = useLanguage();
  const { updateQueryParams } = useQueryParams();

  const [stores, setStores] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });
  const { role, user } = useDashboardAuth();

  // Define columns (similar to getColumns for products)
  const columns = getStoreColumns(t, setRefresh);

  // Fetch data on mount or when dependencies change
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prepare filters the same way you do for products
        const filters = {
          page,
          limit,
          filters: {
            name,
            country,
            city,
            sectionId: section,
            approved,
          },
        };

        // Adjust the endpoint to point to your store listing
        const response = await fetchDataTable(`/admin/stores`, filters);

        setStores(response.data || []);
        setTotalStores(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
      } catch (err) {
        setError(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [page, limit, name,section, country, city, approved, refresh, t]);

  /**
   * Pagination & Sorting Handlers
   */
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateQueryParams({ limit: newSize.toString(), page: "1" });
  };

  const handleSortChange = (field: string, order: string) => {
    updateQueryParams({ sortField: field, sortOrder: order });
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("store.table.title")} (${totalStores})`}
            description={t("store.table.manage_stores")}
          />
          <Link
            href={`/admin/store/add`} // Adjust to your "Add Store" route
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("common.add_new")}
          </Link>
        </div>

        <Separator />

        {/* Filter & Quick Actions Row */}
        <div className="flex items-center gap-4">
          <FilterPopover filterColumns={filterColumns} isApplyingFilters={loading} />

          {hasPermission(role, Permission.ACCESS_ALL_VENDORS) && (
            <CountrySelect
              selectedCountry={+country}
              onCountryChange={(value) =>
                updateQueryParams({ country: value?.toString(), page: "1" })
              }
            />
          )}
          <CitySelect
            countryId={
              hasPermission(role, Permission.ACCESS_ALL_VENDORS)
                ? +country
                : +user.countryId
            }
            initialValue={+city}
            onCityChange={(value) =>
              updateQueryParams({ city: value?.toString(), page: "1" })
            }
          />
          
        </div>
        <div>
          <SectionSelect
            value={+section}
            onChange={(value) =>
              updateQueryParams({ section: value?.toString(), page: "1" })
            }
          />
        </div>
        {/* Data Table */}
        {loading ? (
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        ) : error ? (
          <div className="text-red-600 text-center p-4 bg-red-100 rounded">
            {error}
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={stores}
              // onSortChange={handleSortChange} // If you have sorting in columns
            />

            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.lastPage}
              onPageChange={handlePageChange}
              pageSize={limit}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}
