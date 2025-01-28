import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import ResponsiveModal from "@/components/responsiveDialog";
import QrCode from "./qrCode";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";

export const getColumns = (t, setRefresh) => [

  {
    accessorKey: "roomNumber",
    header: t("room.header.number"), // Translation for Room Number
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: t("room.header.type"), // Translation for Status
    enableSorting: true,
  },
  {
    id: "buttons",
    cell: ({ row }) => {
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      return (
        <>
          <Button
            onClick={() => setIsDeleteOpen(true)}
            className=" text-purple-700"
          >
            {t("room.qrCode")}
          </Button>
          <ResponsiveModal
            title={t("qr.title")}
            description={t("qr.description")}
            open={isDeleteOpen}
            setOpen={setIsDeleteOpen}
            
          >
            <div className="flex justify-center">
              <QrCode link={`${process.env.NEXT_PUBLIC_SELF_URL}/client/checkin/${row.original.uuid}`} uuid={row.original.uuid} roomName={row.original.roomNumber} />
            </div>
          </ResponsiveModal>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} setRefresh={setRefresh} />,
  },
];
