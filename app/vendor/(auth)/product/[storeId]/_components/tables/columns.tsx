// ./tables/store-columns.tsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table"; // or the table library you use
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CellAction } from "./cell-action";

/**
 * You can customize your store columns.
 * For example, if your store object has "id", "name", "country", etc.
 */
export function getColumns(
  t: (key: string,) => string,
  setRefresh: React.Dispatch<React.SetStateAction<number>>
): ColumnDef<any>[] {
  return [

    {
      accessorKey: 'photo_url',
      header: t("common.image"),
      cell: ({ row }) => {
        return (
          <div className="relative aspect-square">
            <Image
              src={`${process.env['NEXT_PUBLIC_IMAGES_URL']}${row.original.image || ""}`}
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
      accessorKey: "catagory.name",
      header: t("store.header.catagory"),
    },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
  ];
}
