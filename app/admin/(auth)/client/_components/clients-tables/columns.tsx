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
    header: t("clients.header.client_name"), // Translated "Client Name"
    enableSorting: true,
  },
  {
    accessorKey: "phoneNo",
    header: t("common.phone"), // Translated "City"
    enableSorting: true,
  },
  {


    accessorKey: "country.name",
    header: t("common.country"), // Translated "City"
    enableSorting: true,
  },





  // {
  //   id: "buttons",
  //   cell: ({ row }) => {
  //     return (
  //       <Link href={`/admin/room/${row.original.id}`}>
  //         <Button className="bg-primary text-black cursor-pointer">
  //           {t("manage_rooms")} {/* Translated "Manage Rooms" */}
  //         </Button>
  //       </Link>
  //     );
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
];
