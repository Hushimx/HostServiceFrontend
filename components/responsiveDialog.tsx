import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {useIsMobile as useMediaQuery } from "@/hooks/use-mobile"

interface ResponsiveModalProps {
  title: string;
  description?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  maxWidth?: string; // Optional custom width
}

const responsiveDialog: React.FC<ResponsiveModalProps> = ({
  title,
  description,
  open,
  setOpen,
  children,
  maxWidth = "max-w-3xl", // Default wider modal
}) => {
  const isMobile = useMediaQuery();
  
  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`w-full ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default responsiveDialog;
