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
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import ResponsiveDialog from "@/components/responsiveDialog";
import { useParams, useRouter } from "next/navigation";

export const CellAction: React.FC<{ data: any,setRefresh:Function }> = ({ data,setRefresh }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { hotelId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetchFromNest(`/admin/vendors/${data.id}`, {
        method: "DELETE",
      });
      
      if (response) {
        toast.success(t("success.delete"));
      }
    } catch (error) {
      toast.error(t("errors.delete"));
    } finally {
      setDialogOpen(false);
      setRefresh(prev=>prev+1)
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
          {/* Edit Vendor */}
          <DropdownMenuItem>
            <Link href={`/admin/vendor/${data.id}`} className="w-full flex">
              <Edit className="mr-2 h-4 w-4" /> {t("common.edit_item")}
            </Link>
          </DropdownMenuItem>

          {/* Delete Vendor */}
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> {t("common.delete_item")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        title={t("common.delete_confirmation_title")}
        description={t("common.delete_confirmation_description")}
        open={dialogOpen}
        setOpen={setDialogOpen}
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            {t("common.ancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t("common.confirm")}
          </Button>
        </div>
      </ResponsiveDialog>
    </>
  );
};
