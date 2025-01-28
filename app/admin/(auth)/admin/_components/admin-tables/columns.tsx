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
    accessorKey: "name",
    header: t("common.name"), // Translated "Admin Name"
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: t("common.email"), // Translated "Email"
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: t("common.role"), // Translated "Role"
    enableSorting: true,
    cell: ({row})=>{
      return <>{t("roles."+ row.original.role)}</>
    }
  },
  {
     accessorKey: "country.name",
    header: t("common.country"), // Translated "Role"
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
];
