"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Pagination } from "@/components/pagination";
import { DataTable } from "@/components/ui/table/data-table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getColumns } from "./tables/columns"; // You will create this
import { cn } from "@/lib/utils";
import Link from "next/link";
import fetchDataTable from "@/lib/fetchDataTable";
import NotFound from "@/app/not-found";

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const { storeId } = useParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name");

  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null); // Store error code if any
  const [meta, setMeta] = useState({ currentPage: page, lastPage: 1 });
  const [refresh, setRefresh] = useState(0);

  const columns = getColumns(t,setRefresh);

  useEffect(() => {
    const fetchProducts = async () => {


      setLoading(true);
      setError(null);

      try {
        const filters = {
          page,
          limit,
          filters: {
            name,
          },
        };

        const response = await fetchDataTable(`/vendor/products/${storeId}`, filters);
        setProducts(response.data || []);
        setTotalProducts(response.meta?.total || 0);
        setMeta({
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1,
        });
      } catch (err: any) {
        if (err?.code === 404) {

          setError(404); // Store error code for NotFoundPage
        } else {
          setError(500); // Handle other errors (generic server error)
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, name, storeId,refresh]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newSize.toString());
    params.set("page", "1");
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  if (error === 404) {
    return <NotFound />; // Render 404 component
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-red-600 text-center p-4 bg-red-100 rounded">
          {t("errors.fetch")}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("products.table.name")} (${totalProducts})`}
            description={t("products.table.manage_products")}
          />
          <Link
            href={`/vendor/product/${storeId}/add`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("common.add_new")}
          </Link>
        </div>
        <Separator />
        {loading ? (
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        ) : (
          <>
            <DataTable columns={columns} data={products} />
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
