'use client';

import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pagination } from "@/components/pagination"; // Custom Pagination component
import { Skeleton } from "@/components/ui/skeleton"; // Custom Skeleton component
import { CountrySelect, CitySelect } from '@/components/locationFilters'; // Country & City selection components
import { FilterPopover } from '@/components/filterPopover'; // Filter popover component
import { DataTable } from '@/components/datatable';
import { ApiResponse, FetchParams } from '@/types/api';



interface DataTableProps<TData, TValue> {
  hotelId: number,
  columns: ColumnDef<TData, TValue>[]; // Table columns
  fetchData: (params: FetchParams) => Promise<ApiResponse<TData>>; // Data fetching function
  filterColumns: object[]; // Filterable columns
}


export default  function TableContainer<TData, TValue>({
  hotelId,
  columns,
  fetchData,
  filterColumns,
}: DataTableProps<TData, TValue>) {
  // States
  const [data, setData] = useState<TData[]>([]);
  const [displayedData, setDisplayedData] = useState<TData[]>([]); // For delayed data display
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 0, total: 0, perPage: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // Tracks the transition state
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setTransitioning(true);

      try {
        const params: FetchParams = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(sorting.length > 0 && {
            sortField: sorting[0].id,
            sortOrder: sorting[0].desc ? 'desc' : 'asc',
          }),
          filters: {
            ...appliedFilters,
          },
        };

        const response = await fetchData(params,hotelId);

        setData(response.data); // Update fetched data immediately
        setMeta({
          currentPage: response.meta.currentPage,
          lastPage: response.meta.lastPage,
          total: response.meta.total,
          perPage: response.meta.perPage,
        });

        // Delay updating displayedData for smooth transition
        setTimeout(() => {
          setDisplayedData(response.data);
          setTransitioning(false);
        }, 1000); // 1-second delay
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pagination, sorting, appliedFilters, fetchData]);

  // Table Configuration


  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Data Table ({meta.total})
          </h1>
          <p className="text-sm text-gray-500">
            Manage data with filtering and sorting.
          </p>
        </div>
      </div>

      {/* Country and City Selectors */}
      {/* Filter Popover */}
      <div className="flex items-center space-x-4">
        <FilterPopover
          filterColumns={filterColumns}
          filters={filters}
          setFilters={setFilters}
          isApplyingFilters={isLoading}
          onApply={() => setAppliedFilters(filters)}
          onReset={() => {
            setFilters({});
            setAppliedFilters({});
          }}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={displayedData}
        isLoading={isLoading}
        transitioning={transitioning}
        pageSize={pagination.pageSize}
        sorting={sorting}
        setSorting={setSorting}
      />

      {/* Pagination */}
      <Pagination
        currentPage={meta.currentPage}
        totalPages={meta.lastPage}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
        }
        pageSize={pagination.pageSize}
        onPageSizeChange={(size) =>
        setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
        }
      />
    </div>
  );
}
