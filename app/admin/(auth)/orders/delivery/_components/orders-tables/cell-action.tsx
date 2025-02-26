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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [status, setStatus] = useState<string>(data.status);
  const [driverId, setDriverId] = useState<string>(data.driverId || ""); // Initialize with current driverId
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch drivers on modal open
  const fetchDrivers = async () => {
    try {
      const response = await fetchFromNest(`/admin/drivers?city=${data.cityId}`);
      if (Array.isArray(response.data)) {
        setDrivers(response.data);
        setDriverId(data.driverId || ""); // Set current driver as selected
      } else {
        setDrivers([]); // Fallback to an empty array
      }
    } catch (error) {
      toast.error(t("errors.fetch"));
      setDrivers([]); // Fallback to an empty array on error
    }
  };

  // Handle Status Update
  const handleStatusUpdate = async () => {
    setIsProcessing(true);
    try {
      await fetchFromNest(`/admin/orders/delivery/${data.id}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(t("success.update"));
      setIsStatusModalOpen(false);
      setRefresh(prev=>prev+1); // Refresh data after success
    } catch (error) {
      toast.error(t("errors.update"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Driver Assignment
  const handleDriverAssignment = async () => {
    setIsProcessing(true);
    try {
      await fetchFromNest(`/admin/orders/delivery/${data.id}`, {
        method: "PATCH",
        body: { driverId: +driverId }, // Ensure driverId is a number
      });
      toast.success(t("success.driver_assignment"));
      setIsDriverModalOpen(false);
      setRefresh(prev=>prev+1); // Refresh data after success
    } catch (error) {
      toast.error(t("errors.driver_assignment"));
    } finally {
      setIsProcessing(false);
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
              href={`/admin/orders/delivery/${data.id}`}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" /> {t("common.view_order")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsStatusModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> {t("common.edit_status")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDriverModalOpen(true);
              fetchDrivers();
            }}
          >
            <Truck className="mr-2 h-4 w-4" /> {t("common.assign_driver")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Status Modal */}
      <ResponsiveDialog
        title={t("common.edit_status_title")}
        description={t("common.edit_status_description")}
        open={isStatusModalOpen}
        setOpen={setIsStatusModalOpen}
      >
        <div className="space-y-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("common.select_status")}
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="PENDING">{t("status.PENDING")}</option>
            <option value="PICKUP">{t("status.PICKUP")}</option>
            <option value="ON_WAY">{t("status.ON_WAY")}</option>
            <option value="COMPLETED">{t("status.COMPLETED")}</option>
            <option value="CANCELED">{t("status.CANCELED")}</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsStatusModalOpen(false)}
              disabled={isProcessing}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isProcessing}>
              {isProcessing ? t("success.updating") : t("common.save")}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Assign Driver Modal */}
      <ResponsiveDialog
        title={t("common.assign_driver")}
        description={t("common.assign_driver_description")}
        open={isDriverModalOpen}
        setOpen={setIsDriverModalOpen}
      >
        <div className="space-y-4">
          <label
            htmlFor="driver"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("common.select_driver")}
          </label>
          <select
            id="driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t("common.placeholders.select_driver_placeholder")}</option>
            {drivers?.length > 0 ? (
              drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.phoneNo}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {t("errors.no_drivers_found")}
              </option>
            )}
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDriverModalOpen(false)}
              disabled={isProcessing}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDriverAssignment}
              disabled={isProcessing || !driverId}
            >
              {isProcessing ? t("common.assigning") : t("common.assign")}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </>
  );
};
