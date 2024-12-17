import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResponsiveModal from "@/components/responsiveDialog";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import Link from "next/link";
import { useParams } from "next/navigation";

export const CellAction: React.FC<{ data: any,row:any }> = ({ data,row }) => {
  const { storeId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [status, setStatus] = useState<string>(data.status); // Initialize with current status
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchFromNest(`/admin/orders/${data.id}`, { method: "DELETE" });
      toast.success("Admin deleted successfully.");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Failed to delete the admin. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  // Handle status update
  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await fetchFromNest(`/admin/orders/${data.id}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success("Status updated successfully.");
      row.original.status = status;
      setIsStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

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
              href={`/dashboard/order/${storeId}/${data.id}`}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" /> Show order
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsStatusModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <ResponsiveModal
        title="Confirm Deletion"
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this admin? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </ResponsiveModal>

      {/* Edit Status Modal */}
      <ResponsiveModal
        title="Edit Status"
        description="Change the status of this admin."
        open={isStatusModalOpen}
        setOpen={setIsStatusModalOpen}
      >
        <div className="space-y-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select a new status:
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELED">Canceled</option>
          </select>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => setIsStatusModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </>
  );
};
