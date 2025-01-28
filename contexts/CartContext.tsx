"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types/store";

interface CartContextType {
  hotelId: string; // Current hotel ID
  storeName: string; // Current store name or ID
  cart: CartItem[]; // Current cart for the selected store and hotel
  total: number; // Total price for the cart
  setStore: (hotelId: string, storeName: string) => void; // Set current hotel and store
  addToCart: (product: Product) => void; // Add product to the cart
  updateQuantity: (productId: string, delta: number) => void; // Update product quantity
  removeFromCart: (productId: string) => void; // Remove a product
  clearCart: () => void; // Clear the current cart
}

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom Hook to Access the Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// CartProvider Component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotelId, setHotelId] = useState<string>(""); // Current hotel ID
  const [storeName, setStoreName] = useState<string>(""); // Current store name
  const [cart, setCart] = useState<CartItem[]>([]); // Current cart for hotel + store

  // Generate a unique key for the cart based on hotelId and storeName
  const cartKey = `cart_${hotelId}_${storeName}`;

  // Load the cart from localStorage when `hotelId` or `storeName` changes
  useEffect(() => {
    if (hotelId && storeName) {
      const savedCart = localStorage.getItem(cartKey);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [hotelId, storeName]);

  // Save the current cart to localStorage whenever it changes
  useEffect(() => {
    if (hotelId && storeName) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, hotelId, storeName]);

  // Calculate the total price for the current cart
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Set the current hotel and store
  const setStore = (hotel: string, store: string) => {
    setHotelId(hotel);
    setStoreName(store);
  };

  // Add an item to the cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove items with zero quantity
    );
  };

  // Remove an item from the cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear the current cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        hotelId,
        storeName,
        cart,
        total,
        setStore,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
