"use client";

import React, { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useSearchParams } from "next/navigation";
import { FilterPopover } from "@/components/filterPopover";
import fetchDataTable from "@/lib/fetchDataTable";
import { Pagination } from "@/components/pagination";
import { getColumns } from "./orders-tables/columns"; // Use dynamic column getter for orders
import { DataTable } from "@/components/ui/table/data-table";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import { useQueryParams } from "@/hooks/use-queryParams";
import { hasPermission, Permission } from "@/lib/rbac";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVendorAuth } from "@/contexts/vendorAuthContext";



 function OrdersListingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    status,
    clientName,
    hotelName,
    clientNumber,
    country,
    city,
    roomNumber,
  } = Object.fromEntries(searchParams.entries());

  const { updateQueryParams } = useQueryParams();
  const { role, user } = useVendorAuth();
  const { t } = useLanguage();
  const [refresh, setRefresh] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });

  const columns = getColumns(t, setRefresh);

  const filterColumns = [
    {
      id: "status",
      label: t("common.status"),
      type: "select",
      options: [
        { label: t("status.PENDING"), value: "PENDING" },
        { label: t("status.PICKUP"), value: "PICKUP" },
        { label: t("status.IN_PROGRESS"), value: "IN_PROGRESS" },
        { label: t("status.COMPLETED"), value: "COMPLETED" },
        { label: t("status.CANCELED"), value: "CANCELED" },
      ],
    },
    { id: "clientNumber", label: t("common.phone"), type: "input" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          page,
          limit,
          filters: {
            status,
            clientName,
            hotelName,
            clientNumber,
            country,
            city,
            roomNumber,
          },
        };

        const response = await fetchDataTable("/vendor/orders/service", filters);
        setOrders(response.data || []);
        setTotalOrders(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
        lastPage: response.meta?.lastPage || 1,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    page,
    limit,
    status,
    clientName,
    hotelName,
    clientNumber,
    country,
    city,
    roomNumber,
    refresh,
  ]);

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
            title={`${t("common.servicesOrders")} (${totalOrders})`}
            description={t("common.manage_orders")}
          />
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
            <DataTable columns={columns} data={orders} />
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
export default OrdersListingPage;