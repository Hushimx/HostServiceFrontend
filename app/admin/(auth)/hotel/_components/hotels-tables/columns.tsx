import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CellAction } from "./cell-action";
import { Cell } from "recharts";

export const getColumns = (t,setRefresh) => [
  {
    accessorKey: "id",
    header: t("common.id"), // Translated "ID"
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: t("common.name"), // Translated "Hotel Name"
    enableSorting: true,
  },
  {
    accessorKey: "city.name",
    header: t("common.city"), // Translated "City"
    enableSorting: true,
  },
  {
    id: "createdAt",
    header: t("common.created_at"), // Translated "Created At"
    cell: ({ row,Cell }) => {
      return <>{new Date(row.original.createdAt).toLocaleString()}</>;
    },
  },
  {
    id: "buttons",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/room/${row.original.id}`}>
          <Button className="bg-primary text-black cursor-pointer">
            {t("rooms.table.manage_rooms")} {/* Translated "Manage Rooms" */}
          </Button>
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
];
