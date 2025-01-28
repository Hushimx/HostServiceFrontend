// ./tables/store-columns.tsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table"; // or the table library you use
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CellAction } from "./cell-action";
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
          <div className="relative aspect-square max-h-16">
            <Image
              
              src={getImageUrl(row.original.image)}
              alt={row.getValue('name')}
              fill
              className="rounded-lg relative aspect-square "
            />
          </div>
        );
      }
    },
    {
      accessorKey: "title",
      header: t("common.title"),
    },
    {
      accessorKey: "city.name",
      header: t("common.city"),
    },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction data={row.original} setRefresh={setRefresh} />;
    },
  },
  ];
}
