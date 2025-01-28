import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export const CellAction: React.FC<{ data: any,setRefresh:Function }> = ({ data,setRefresh }) => {
  const { t } = useLanguage();



  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Edit Vendor */}
          <DropdownMenuItem>
            <Link href={`/vendor/service/${data.id}`} className="w-full flex">
              <Edit className="mr-2 h-4 w-4" /> {t("common.edit_item")}
            </Link>
          </DropdownMenuItem>


        </DropdownMenuContent>
      </DropdownMenu>


    </>
  );
};
