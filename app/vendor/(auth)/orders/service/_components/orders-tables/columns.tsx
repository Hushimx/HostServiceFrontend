'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Cell } from 'recharts';

export const getColumns = (t, setRefresh) => [
  {
    accessorKey: "id",
    header: t("common.id"), // Translated "ID"
    enableSorting: true,
  },
  {
    accessorKey: "serviceName",
    header: t("services.table.name"), // Translated "Store"
    enableSorting: true,
  },
  {
    accessorKey: "clientNumber",
    header: t("common.phone"), // Translated "Phone Number"
    enableSorting: true,
  },


  {
    accessorKey: "status",
    header: t("common.status"), // Translated "Status"
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
  
      // Define Tailwind classes for each status
      const statusClasses = {
          PENDING: "bg-orange-100 text-orange-800",
          PICKUP: "bg-blue-100 text-blue-800",
          IN_PROGRESS: "bg-purple-100 text-purple-800",
          COMPLETED: "bg-green-100 text-green-800",
          CANCELED: "bg-red-100 text-red-800",
      };
  
      return (
          <span
              className={`px-3 py-3 rounded-md text-sm font-bold text-nowrap ${
                  statusClasses[status]
              }`}
          >
              {t(`status.${status}`)}
          </span>
      );
    }
  
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
];
