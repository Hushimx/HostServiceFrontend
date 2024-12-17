import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ResponsiveModal from "@/components/responsiveDialog";
import GeneralForm from "@/components/generalForm";
import AdminEditingForm from "./editingAdmin";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import Link from "next/link";

export const CellAction: React.FC<{ data: any }> = ({ data }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditSubmit = async (formData: any) => {
    try {
      console.log("Updating admin:", formData);
  
      // Use centralized fetch utility
      const response = await fetchFromNest(`/admin/admins/${data.id}`, {
        method: "PATCH",
        body: formData,
      });
  
      toast.success("Admin updated successfully!");
      setIsEditOpen(false); // Close the modal
    } catch (error: any) {
      console.error("Failed to update admin:", error.message);
  
      // Handle specific errors with toast
      if (error.message.includes("Forbidden")) {
        toast.error("You don't have the necessary permissions to update this admin.");
      } else if (error.message.includes("Not Found")) {
        toast.error("The admin you're trying to update does not exist.");
      } else if (error.message.includes("Server Error")) {
        toast.error("An internal server error occurred. Please try again later.");
      } else {
        toast.error(error.message || "Something went wrong while updating the admin.");
      }
    }
  };
  


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
            <Edit className="mr-2 h-4 w-4" /> Edit Admin
                  </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log(`Deleting ${data.id}`)}>
            <Trash className="mr-2 h-4 w-4" /> Delete Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    
    </>
  );
};
