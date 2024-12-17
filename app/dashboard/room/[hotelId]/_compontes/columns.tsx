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
      accessorKey: "roomNumber",
      header: "Room Number",
      enableSorting: true,
  
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
    },
    {
      id: 'buttons',
      cell: ({ row }) => {
          return (
            <ResponsiveModal title="QR Code" triggerText="Generate QR Code" description="Generate QR Code">
            <div className="flex justify-center">
            <QrCode link={row.original.uuid} roomName={row.original.roomNumber} />
            </div>
          </ResponsiveModal>
            )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
  }
  ];
  