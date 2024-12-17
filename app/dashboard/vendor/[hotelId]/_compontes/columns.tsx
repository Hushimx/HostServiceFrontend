import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CellAction } from "./formActions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ResponsiveModal from "@/components/responsiveDialog";
import QrCode from "./qrCode";


export const columns: ColumnDef<any>[] = [
    {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
            return           <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
    },
        enableSorting: false,
        enableHiding: false
      },
    {
      accessorKey: "name",
      header: "name",
      enableSorting: true,
  
    },
    {
      accessorKey: "city.name",
      header: "City",
      enableSorting: true,
  
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
  }
  ];
  