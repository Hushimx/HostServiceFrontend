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
import { getColumns } from "./service-tables/columns"; // Dynamic columns for services
import { DataTable } from "@/components/ui/table/data-table";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/use-queryParams";
import { FilterPopover } from "@/components/filterPopover";

const filterColumns = [
  { id: "name", label: "Service Name" },
  { id: "slug", label: "Slug" },
];

export default function ServicesListingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("common.name");
  const slug = searchParams.get("slug");
  const { t } = useLanguage();
  const { updateQueryParams } = useQueryParams();

  const [services, setServices] = useState([]);
  const [refresh, setRefresh] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
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
            slug,
          },
        };

        const response = await fetchDataTable("/admin/services/list", filters);
        setServices(response.data || []);
        setTotalServices(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, name, slug,refresh]);

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
            title={`${t("services.table.title")} (${totalServices})`}
            description={t("services.table.manage_services")}
          />
          <Link
            href={"/admin/service/list/add"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("common.add")}
          </Link>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <FilterPopover
            filterColumns={filterColumns}
            isApplyingFilters={loading}
          />
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
