// ./tables/store-columns.tsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table"; // or the table library you use
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CellAction } from "./cell-action";
import { get } from "http";
import { getImageUrl } from "@/lib/utils";

/**
 * You can customize your store columns.
 * For example, if your store object has "id", "name", "country", etc.
 */
export function getStoreColumns(
  t: (key: string) => string,
  setRefresh: React.Dispatch<React.SetStateAction<number>>
): ColumnDef<any>[] {
  return [

    {
      accessorKey: 'image',
      header: t("common.image"),
      cell: ({ row }) => {
        return (
          <div className="relative aspect-square">
            <Image
              src={getImageUrl(row.getValue('image'))}
              alt={row.getValue('name')}
              fill
              className="rounded-lg"
            />
          </div>
        );
      }
    },
    {
      accessorKey: "name",
      header: t("store.header.name"),
    },
    {
      accessorKey: "city.name",
      header: t("common.city"),
    },
    {
      accessorKey: "section.name",
      header: t("store.header.section"),
    },
    {
      accessorKey: "buttons",
      header: "",

      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const store = row.original;
        return (
          <div className="flex gap-2">
            <Link
              href={`/admin/product/${store.id}`}
            >
              <Button className=" text-purple-700">
                {t("products.table.title")}
              </Button>
            </Link>
          </div>
            )
    },

  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
  ];
}
