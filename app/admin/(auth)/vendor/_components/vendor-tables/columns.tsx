'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';


export const getColumns = (t,setRefresh) => [
  {
    accessorKey: "name",
    header: t("vendors.table.vendor_list"),
    enableSorting: true,


  },
  {
    accessorKey: "email",
    header: t("vendors.table.vendor_email"),
    enableSorting: true,
  },
  {
    accessorKey: "phoneNo",
    header: t("vendors.table.vendor_phone"),
    enableSorting: true,
  },
  {
    accessorKey: "city.name",
    header: t("vendors.table.vendor_city"),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} setRefresh={setRefresh} />,
  },
];
