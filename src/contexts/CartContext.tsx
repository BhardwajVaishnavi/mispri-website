'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
          // Load cart from backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/cart?userId=${user.id}`);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productId: item.id,
            quantity: 1,
          }),
        });

        if (response.ok) {
          // Reload cart from backend
          const cartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'}/cart?userId=${user.id}`);
          if (cartResponse.ok) {
            const cart = await cartResponse.json();
            const cartItems = cart.items?.map((cartItem: any) => ({
              id: cartItem.product.id,
              name: cartItem.product.name,
              price: cartItem.product.price,
              quantity: cartItem.quantity,
              image: cartItem.product.imageUrl || '/images/placeholder.jpg'
            })) || [];
            setCartItems(cartItems);
            return;
          }
        }
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }

    // Fallback to local state update
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

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
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
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
