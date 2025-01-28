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
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh}  />;
    },
  },
];
