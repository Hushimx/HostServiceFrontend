"use client";

import React, { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useSearchParams } from "next/navigation";
import { FilterPopover } from "@/components/filterPopover";
import fetchDataTable from "@/lib/fetchDataTable";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import { useQueryParams } from "@/hooks/use-queryParams";
import { Pagination } from "@/components/pagination";
import { getColumns } from "./vendor-tables/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { hasPermission, Permission } from "@/lib/rbac";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import { userAgent } from "next/server";
import { useLanguage } from "@/contexts/LanguageContext";


export default function EmployeeListingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phoneNo = searchParams.get("phoneNo");
  const country = searchParams.get("country");
  const city = searchParams.get("city");
  const { updateQueryParams } = useQueryParams();

  const [employees, setEmployees] = useState([]);
  const [totalVendors, setTotalVendors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const [refresh, setRefresh] = useState(0); // Error state
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });
  const {role,user} = useDashboardAuth()
  const { t } = useLanguage()
  const columns = getColumns(t,setRefresh);

  const filterColumns = [
    { id: "name",label:t("common.name") },
    { id: "email",label:t("common.email") },
    { id: "phoneNo",label:t("common.phone") },
  ];
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const filters = {
          page,
          limit,
          filters: {
            name,
            country,
            city,
            email,
            phoneNo,
          },
        };

        const response = await fetchDataTable("/admin/vendors", filters);
        setEmployees(response.data || []);
        setTotalVendors(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
        await new Promise((res)=>{setTimeout(() => {
          res("")
        }, 600)})
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employees. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, name, email, phoneNo, country, city,refresh]);

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
            title={`${t("vendors.table.vendor_list")} (${totalVendors})`}
            description={t("vendors.table.manage_vendors")}
          />
          <Link
            href={"/admin/vendor/add"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("common.add_new")}
          </Link>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <FilterPopover
            filterColumns={filterColumns}
            isApplyingFilters={loading}
          />
          {hasPermission(role,Permission.ACCESS_ALL_VENDORS) && <CountrySelect
            selectedCountry={+country}
            onCountryChange={(country) => {
              if(!country && city){
                updateQueryParams({ city: "", country: "" })

              }else{
              updateQueryParams({ country: country?.toString() })

              }
            }}
          />}
          <CitySelect
            countryId={hasPermission(role,Permission.ACCESS_ALL_VENDORS) ? +country : +user.countryId}
            initialValue={+city}
            onCityChange={(city) =>
              updateQueryParams({ city: city?.toString() })
            }
          />
        </div>
        {loading ? (
          <DataTableSkeleton columnCount={5} rowCount={10} />
        ) : error ? (
          <div className="text-red-600 text-center p-4 bg-red-100 rounded">
            {error}
          </div>
        ) : (
          <>
          <DataTable
            columns={columns}
            data={employees}
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
