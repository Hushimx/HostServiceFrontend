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
    header: t("services.table.name"), // Translated "Service Name"
    enableSorting: true,
  },
  {
    accessorKey: "slug",
    header: t("services.table.slug"), // Translated "Service Name"
    enableSorting: true,
  },

  {
    accessorKey: "description",
    header: t("common.description"), // Translated "Description"
    enableSorting: false,
  },
  {
    id: "vendors",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/service/city?serviceId=${row.original.id}`}>
          <Button className="bg-primary text-black cursor-pointer">
            {t("common.cities")} {/* Translated "View Vendors" */}
          </Button>
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh}  />;
    },
  },
];
