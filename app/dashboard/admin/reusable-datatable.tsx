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
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';

// Types
export interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  };
}

export interface FetchParams {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Table columns
  fetchData: (params: FetchParams) => Promise<ApiResponse<TData>>; // Data fetching function
  filterColumns: object[]; // Filterable columns
}


export function TableContainer<TData, TValue>({
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
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

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
            ...(selectedCountry && { country: selectedCountry }),
            ...(selectedCity && { cityId: selectedCity }),
          },
        };

        const response = await fetchData(params);

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
  }, [pagination, sorting, appliedFilters, selectedCountry, selectedCity, fetchData]);

  // Table Configuration


  return (
    <>
    <div className="flex items-start justify-between">

    <Heading
            title="Admins"
            description="Manage Admins"
          />
          <Link
            href="/dashboard/admin/add"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-4">

      {/* Country and City Selectors */}
      <div className="flex items-center space-x-4">
        <CountrySelect  onChange={setSelectedCountry} />
        </div>

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
    </>
  );
}
