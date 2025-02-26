"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";

// Dynamically load Lottie for better performance
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

interface SuccessComponentProps {
  isOpen: boolean;
  onClose: () => void;
  button: React.ReactNode;
}

export default function SuccessComponent({ isOpen, onClose,button }: SuccessComponentProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile(); // Determine if the user is on mobile

  if (!isOpen) return null;

  const Content = () => (
    <div className="flex flex-col items-center justify-center space-y-6 mt-4">
      {/* Lottie Animation */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/4f39ab4b-faae-4faf-a0e4-cc1cbd815aab/o2UiDBnTsQ.lottie"
          height={200}
          autoplay
        />
      </div>
      {/* Message */}
      <p className="text-lg text-gray-800 text-center leading-relaxed">
      </p>
    </div>
  );

  const Footer = () => (
    <div className="mt-4 w-full">
    {button}
    </div>
  );

  return isMobile ? (
    // Drawer for Mobile
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-green-600 text-2xl font-bold">
            {t("checkout.sucess")}
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            {/* {t("checkout.orders_success_message")} */}
          </DrawerDescription>
        </DrawerHeader>
        <Content />
        <DrawerFooter>
          <Footer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    // Modal for PC
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-green-600 text-2xl font-bold text-center">
          {t("checkout.sucess")}
        </h2>
        {/* <p className="text-gray-600 text-center mt-2">{t("orders_success_message")}</p> */}
        <Content />
        <Footer />
      </div>
    </div>
  );
}
