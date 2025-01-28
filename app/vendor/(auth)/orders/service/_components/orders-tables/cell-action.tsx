import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import ResponsiveDialog from "@/components/responsiveDialog";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

export const CellAction: React.FC<{ data: any;  setRefresh: (prev) => void }> = ({
  data,
  setRefresh,
}) => {
  const { t } = useLanguage();

  // Fetch drivers on modal open
  // Handle Status Update

  // Handle Driver Assignment

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={`/vendor/orders/service/${data.id}`}
              className="flex items-center"
            >
              
              <Edit className="mr-2 h-4 w-4" /> {t("services.table.view_order")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Status Modal */}

      {/* Assign Driver Modal */}
    </>
  );
};
