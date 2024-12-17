import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ResponsiveModal from "@/components/responsiveDialog";
import GeneralForm from "@/components/generalForm";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import Link from "next/link";

 const CellAction: React.FC<{ data: any }> = ({ data }) => {



  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem >
            <Link href={`/dashboard/hotel/${data.id}`} className="w-fit">
            <Edit className="mr-2 h-4 w-4" /> Edit Hotel
                  </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log(`Deleting ${data.id}`)}>
            <Trash className="mr-2 h-4 w-4" /> Delete Hotel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    
    </>
  );
};


export default CellAction