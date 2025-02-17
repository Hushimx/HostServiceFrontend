"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Home, Package } from 'lucide-react'; // Importing icons from lucide-react
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

export default function FooterNav() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route path
  const isMobile = useIsMobile();
  const [active, setActive] = useState<string>('');

  // Update active state when pathname changes
  useEffect(() => {
    if (pathname === '/client') {
      setActive('home');
    } else if (pathname === '/client/orders') {
      setActive('orders');
    }
  }, [pathname]);

  // Don't render the footer under the `/store` path
  if (pathname.includes('/store')) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <nav
          style={{ backgroundColor: "#00000070", backdropFilter: "blur(18px)" }}
          className="fixed rounded-t-md bottom-0 left-0 right-0 text-white flex justify-evenly items-center py-3 shadow-lg z-10"
        >
          {/* Home Button */}
          <button
            onClick={() => {
              setActive('home');
              router.push('/client');
            }}
            className={`flex flex-col items-center duration-300 ${
              active === 'home' ? 'text-yellow-400' : 'text-white'
            }`}
          >
            <Home className="w-7 h-7 mb-1" /> {/* Larger Icon */}
            <span className="text-sm font-medium">Home</span> {/* Larger Text */}
          </button>

          {/* Orders Button */}
          <button
            onClick={() => {
              setActive('orders');
              router.push('/client/orders');
            }}
            className={`flex flex-col items-center duration-300 ${
              active === 'orders' ? 'text-yellow-400' : 'text-white'
            }`}
          >
            <Package className="w-7 h-7 mb-1" /> {/* Larger Icon */}
            <span className="text-sm font-medium">Orders</span> {/* Larger Text */}
          </button>
        </nav>
      )}
    </>
  );
}
