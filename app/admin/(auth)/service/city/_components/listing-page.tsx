"use client";

import React, { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useParams, useSearchParams } from "next/navigation";
import fetchDataTable from "@/lib/fetchDataTable";
import { Pagination } from "@/components/pagination";
import { getColumns } from "./service-tables/columns"; // Dynamic columns for services
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
import { VendorSelect } from "@/components/ui/vendorSelect";
import ServiceSelect from "@/components/ui/serviceSelect";
import NotFound from "@/app/not-found";


export default function ServicesListingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const country = searchParams.get("country");
  const city = searchParams.get("city");
  const vendorId = searchParams.get("vendorId");
  const serviceId = searchParams.get("serviceId");
  const { t } = useLanguage();
  const { updateQueryParams } = useQueryParams();
  const {user,role } = useDashboardAuth()
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });
  const [refresh,setRefresh] = useState(0)
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
            country,
            city,
            vendorId,
            serviceId
          },
        };

        const response = await fetchDataTable(`/admin/services/cities`, filters);
        setServices(response.data || []);
        setTotalServices(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
      } catch (err) {
        console.error("Error fetching services:", err);
        if (err?.code === 404) {
          setError(404); // Store error code for NotFoundPage
        }
        setError(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit,country,city,  serviceId,vendorId,refresh]);

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage.toString() });
  };

  const handlePageSizeChange = (newSize) => {
    updateQueryParams({ limit: newSize.toString(), page: "1" });
  };
  if(error === 404) {
    return (<NotFound />)
  }
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("services_cities.table.title")} (${totalServices})`}
            description={t("services.table.manage_services")}
          />
          <Link
            href={"/admin/service/city/add"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("services.add.title")}
          </Link>
        </div>
        <Separator />
        <div className="flex items-center gap-4">

                    {hasPermission(role, Permission.ACCESS_ALL_VENDORS) && (
            <CountrySelect
              selectedCountry={+country}
              onCountryChange={(value) =>
                updateQueryParams({ country: value?.toString(), page: "1", city: "", vendorId: "" })
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
              updateQueryParams({ city: value?.toString(), page: "1",vendorId: "" })
            }

          />
          

        </div>
        <div className="flex items-center gap-4">
        <VendorSelect city={+city} value={+vendorId} onSelect={(vendorId) => updateQueryParams({ vendorId: vendorId?.toString(), page: "1" })} />
        <ServiceSelect value={+serviceId} onChange={(serviceId) => updateQueryParams({ serviceId: serviceId?.toString(), page: "1" })} />
        </div>
        {loading ? (
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        ) : error ? (
          <div className="text-red-600 text-center p-4 bg-red-100 rounded">
            {error}
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={services} />
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
