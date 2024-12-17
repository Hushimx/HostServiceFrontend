'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'roomName',
    header: 'ROOM NAME'
  },
  {
    accessorKey: 'hotelName',
    header: 'HOTEL NAME'
  },
  {
    accessorKey: 'cityId',
    header: 'CITY'
  },
  {
    accessorKey: 'clientId',
    header: 'CLIENT'
  },
  {
    accessorKey: 'paymentMethod',
    header: 'PAYMENT METHOD'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
cell: ({ row }) => (
  <div className="flex items-center gap-x-2">
    <span
      className={`px-2 py-1 rounded text-sm ${
        row.original.status === 'PENDING'
          ? 'bg-yellow-100 text-yellow-600'
          : row.original.status === 'SHIPPED'
          ? 'bg-blue-100 text-blue-600'
          : row.original.status === 'DELIVERED'
          ? 'bg-green-100 text-green-600'
          : 'bg-red-100 text-red-600'
      }`}
    >
      {row.original.status}
    </span>
  </div>
)  },
  {
    accessorKey: 'total',
    header: 'TOTAL'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
