"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/client/store/ProductCard";
import CartContent from "@/components/client/store/Cart";
import { Product } from "@/types/store";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileCart from "@/components/client/store/MobileCart";
import { StoreHeader } from "@/components/client/store/Header";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Loading from "@/components/ui/loading";
import { UUID } from "crypto";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/app/not-found";

export default function Store({
  storeId,
}: {
  storeId: String;
}) {
  const [storeData, setStoreData] = useState<{ storeName: string; description: string; image: string } | {}>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); // Add a state for 404
  const isMobile = useIsMobile();
  const { user } = useClientAuth();
  const router = useRouter();

  const {
    cart,
    total,
    setStore,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { t } = useLanguage();
  useEffect(() => {
    setStore(`${user.hotelName}-${storeId}`, storeId);
  }, [storeId, setStore]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/stores/id/${storeId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 404) {
        setNotFound(true);
        return;
      }

      if (!response.ok) {
        throw new Error(t("errors.fetch"));
      }

      const data = await response.json();
      setProducts(data.products);
      setStoreData({
        storeName: data.storeName,
        description: data.description,
        image: data.image,
        banner: data.banner,
      });
    } catch (error) {
      
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  if (isLoading) {
    return <Loading message={t("common.loading")} />;
  }

  if (notFound) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <StoreHeader storeData={storeData} />
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {products.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartItem={cartItem}
                  currencySign={user?.currencySign}
                  onAddToCart={() => addToCart(product)}
                  onUpdateQuantity={(productId, delta) =>
                    updateQuantity(productId, delta)
                  }
                />
              );
            })}
          </div>
        </div>

        {!isMobile && (
          <div className="w-full md:w-[350px] md:sticky md:top-6">
            <CartContent
              cart={cart}
              total={total}
              onUpdateQuantity={(productId, delta) =>
                updateQuantity(productId, delta)
              }
              onRemoveFromCart={(productId) => removeFromCart(productId)}
            />
          </div>
        )}
      </div>

      {isMobile && (
        <MobileCart
          cart={cart}
          total={total}
          updateQuantity={(productId, delta) =>
            updateQuantity(productId, delta)
          }
          removeFromCart={(productId) => removeFromCart(productId)}
        />
      )}
    </div>
  );
}
