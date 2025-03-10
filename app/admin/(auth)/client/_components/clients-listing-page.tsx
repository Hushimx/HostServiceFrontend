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
import { getColumns } from "./clients-tables/columns"; // Dynamic columns for clients
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

const filterColumns = [
  { id: "name", label: "Name" },
  { id: "phoneNo", label: "Phone Number" },
];

export default function ClientListingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name");
  const phoneNo = searchParams.get("phoneNo");
  const country = searchParams.get("country");
  const { t } = useLanguage();
  const { updateQueryParams } = useQueryParams();
  const { role, user } = useDashboardAuth();
  
  const [clients, setClients] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });
  const columns = getColumns(t,setRefresh);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          page,
          limit,
          filters: {
            name,
            phoneNo,
            country,
          },
        };

        const response = await fetchDataTable("/admin/clients", filters);
        setClients(response.data || []);
        setTotalClients(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, name,phoneNo, country,refresh]);

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage.toString() });
  };

  const handlePageSizeChange = (newSize) => {
    updateQueryParams({ limit: newSize.toString(), page: "1" });
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("clients.table.title")} (${totalClients})`}
            description={t("")}
          />
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <FilterPopover
            filterColumns={filterColumns}
            isApplyingFilters={loading}
          />
          {hasPermission(role, Permission.ACCESS_ALL_VENDORS) && (
            <CountrySelect
              selectedCountry={+country}
              onCountryChange={(country) => {
                if (!country && city) {
                  updateQueryParams({ city: "", country: "", page: "" });
                } else {
                  updateQueryParams({ country: country?.toString(),page: ""  });
                }
              }}
            />
          )}

        </div>
        {loading ? (
          <DataTableSkeleton columnCount={columns.length} rowCount={10}/>
        ) : error ? (
          <div className="text-red-600 text-center p-4 bg-red-100 rounded">
            {error}
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={clients}   />
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
