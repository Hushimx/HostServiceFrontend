import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"; // Ensure this path matches your setup
import { Button } from "@/components/ui/button";
import CartContent from "@/components/client/store/Cart";
import { CartItem } from "@/types/store";
import { useLanguage } from "@/contexts/LanguageContext"; // استدعاء الترجمة

interface MobileCartProps {
  cart: CartItem[];
  total: number;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
}

export default function MobileCart({
  cart,
  total,
  updateQuantity,
  removeFromCart,
}: MobileCartProps) {
  const { t } = useLanguage(); // استخدام الترجمة

  return (
    <Drawer>
      {/* Drawer Trigger */}
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 left-4 right-4 z-50 bg-purple-600 text-white">
          {t("cart.view")} ({cart.length})
        </Button>
      </DrawerTrigger>

      {/* Drawer Content */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("cart.title")}</DrawerTitle>
          <DrawerDescription>
            {t("cart.description")}
          </DrawerDescription>
        </DrawerHeader>

        {/* Cart Content */}
        <CartContent
          cart={cart}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
        />

        {/* Footer */}
        <DrawerFooter>

          <DrawerClose asChild>
            <Button variant="outline" className="mt-2 w-full">
              {t("checkout.close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
