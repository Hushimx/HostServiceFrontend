import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { CartItem } from '@/types/store';
import { memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { getImageUrl } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CartContentProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

const CartContent = memo<CartContentProps>(
  ({ cart, total, onUpdateQuantity, onRemoveFromCart }) => {
    const { t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useClientAuth();
    const currency = user?.currencySign || '$';

    const handleConfirmOrder = () => {
      router.push(`${pathname}/checkout`);
    };

    return (
      <div className="flex flex-col px-5">
        <h2 className="text-lg font-semibold mb-4">{t('cart.title')} ({cart.length})</h2>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingCart className="h-16 w-16 mb-4" />
            <p className="text-lg">{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="h-[250px] pr-4 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 mb-4 p-2 bg-gray-50 rounded-lg"
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          {currency} {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          x
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />

            {/* Cart Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-t">
                <span className="font-semibold text-lg">{t('cart.total')}</span>
                <span className="font-bold text-lg text-purple-700">
                  {currency} {total.toFixed(2)}
                </span>
              </div>

              {/* Confirm Order Button */}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 rounded-lg"
                onClick={handleConfirmOrder}
              >
                {t('common.confirm')}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
);

CartContent.displayName = 'CartContent';
export default CartContent;
