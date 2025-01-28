// src/components/ProductCard/ProductCard.tsx
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, CartItem } from "@/types/store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClientAuth } from "@/contexts/ClientAuthContext"; // Import client auth for currency
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const isMobile = useIsMobile();
  const { user } = useClientAuth(); // Access user context for currency
  const currency = user?.currencySign; // Default to USD if no currency is provided

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex border border-gray-200 rounded-lg shadow-sm overflow-hidden p-3">
        {/* Image Section */}
        <div className="relative w-32 h-32 flex-shrink-0 max-w-full">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded-lg max-w-full"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between flex-grow pl-4 mr-5">
          {/* Title and Description */}
          <div>
            <h3 className="text-base font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          </div>

          {/* Price and Cart Controls */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-purple-700 font-bold">
             {product.price.toFixed(2)} {currency} 
            </p>

            {cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold"
                  onClick={() => onUpdateQuantity(product.id, -1)}
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold">
                  {cartItem.quantity}
                </span>
                <button
                  className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold"
                  onClick={() => onUpdateQuantity(product.id, 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="text-sm bg-purple-600 text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-purple-700"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PC Layout
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square">
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover"
        />

        {/* Overlay for Button or Quantity Controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-end justify-center">
          {cartItem ? (
            <div className="flex items-center gap-2 bg-white p-2 rounded-full mb-4 shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-black"
                onClick={() => onUpdateQuantity(product.id, -1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-medium">
                {cartItem.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-black"
                onClick={() => onUpdateQuantity(product.id, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(product)}
              className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg mb-4"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-sm text-gray-500">{product.category}</p>
        <h3 className="text-lg font-medium mt-1">{product.name}</h3>
        <p className=" text-purple-700 text-lg font-bold mt-2">
          {currency}
          {" "}
          {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
