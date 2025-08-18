'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackAddToCart } from '@/components/Analytics';

export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  costPrice?: number;
  sku?: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: ProductVariant;
  weight?: string;
  variantId?: string;
  customName?: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from backend or localStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      // Try to get user from auth context
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Load cart from backend via local API
          const response = await fetch(`/api/cart?userId=${user.id}`);
          if (response.ok) {
            const cart = await response.json();
            const cartItems = cart.items?.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.imageUrl || '/images/placeholder.jpg'
            })) || [];
            setCartItems(cartItems);
            setCartCount(cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0));
            return;
          }
        } catch (error) {
          console.error('Error loading cart from backend:', error);
        }
      }

      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.reduce((total: number, item: CartItem) => total + item.quantity, 0));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes (backup)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    // Try to sync with backend first
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productId: item.id,
            variantId: item.variantId,
            quantity: 1,
          }),
        });

        if (response.ok) {
          // Reload cart from backend
          const cartResponse = await fetch(`/api/cart?userId=${user.id}`);
          if (cartResponse.ok) {
            const cart = await cartResponse.json();
            const cartItems = cart.items?.map((cartItem: any) => ({
              id: cartItem.product.id,
              name: cartItem.product.name,
              price: cartItem.variant?.price || cartItem.product.price,
              quantity: cartItem.quantity,
              image: cartItem.product.imageUrl || '/images/placeholder.jpg',
              variant: cartItem.variant,
              weight: cartItem.variant?.weight,
              variantId: cartItem.variant?.id,
              customName: cartItem.customName || null,
            })) || [];
            setCartItems(cartItems);

            // Track add to cart event
            trackAddToCart({
              item_id: item.id,
              item_name: item.name,
              category: 'Product', // You can enhance this with actual category
              quantity: 1,
              price: item.price,
            });

            return;
          }
        }
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }

    // Fallback to local state update
    setCartItems(prevItems => {
      // Check if item already exists in cart (considering variant)
      const existingItemIndex = prevItems.findIndex(cartItem =>
        cartItem.id === item.id && cartItem.variantId === item.variantId
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        const newItems = [...prevItems, { ...item, quantity: 1 }];

        // Track add to cart event for new items
        trackAddToCart({
          item_id: item.id,
          item_name: item.name,
          category: 'Product', // You can enhance this with actual category
          quantity: 1,
          price: item.price,
        });

        return newItems;
      }
    });
  };

  const removeFromCart = (id: string, variantId?: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === id && (variantId ? item.variantId === variantId : true))
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, variantId?: string) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && (variantId ? item.variantId === variantId : true)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
