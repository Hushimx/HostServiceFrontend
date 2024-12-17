'use client';

import React from 'react';
import {
  ColumnDef,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from './pagination';

interface DataTableCoreProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Table columns
  data: TData[]; // Table data
  isLoading: boolean; // Loading state
  transitioning: boolean; // Transition state for delayed rendering
  pageSize: number; // Number of rows per page
  sorting: any; // Sorting state
  setSorting: (sorting: any) => void; // Sorting handler
  pagination: any; // Pagination state
  meta: any; // Pagination metadata
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  transitioning,
  pageSize,
  sorting,
  setSorting,
}: DataTableCoreProps<TData, TValue>) {
  const table = useReactTable({
    data: data, // Use displayedData to delay rendering
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    manualPagination: true,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  className={
                    header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getIsSorted() && (
                    header.column.getIsSorted() === "asc" ? " ▲" : " ▼"
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {transitioning || isLoading ? (
            // Show skeletons during loading or transition
            Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
