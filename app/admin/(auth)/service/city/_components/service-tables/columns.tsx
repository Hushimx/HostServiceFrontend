import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CellAction } from "./cell-action";

export const getColumns = (t, setRefresh) => [
  {
    accessorKey: "id",
    header: t("common.id"), // Translated "ID"
    enableSorting: true,
  },
  {
    accessorKey: "service.name",
    header: t("services.table.name"), // Translated "Service Name"
    enableSorting: true,
  },
  {
    accessorKey: "city.name",
    header: t("common.city"), // Translated "Description"
    enableSorting: false,
  },
  {
    accessorKey: "vendor.name",
    header: t("vendors.table.vendor"), // Translated "Description"
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh}  />;
    },
  },
];
