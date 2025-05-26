'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  description?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistItems(parsedWishlist);
          setWishlistCount(parsedWishlist.length);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      }
    } else {
      // For non-authenticated users, use a general wishlist
      const savedWishlist = localStorage.getItem('wishlist_guest');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistItems(parsedWishlist);
          setWishlistCount(parsedWishlist.length);
        } catch (error) {
          console.error('Error parsing guest wishlist from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const storageKey = isAuthenticated && user ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems, isAuthenticated, user]);

  const addToWishlist = async (item: WishlistItem) => {
    setIsLoading(true);
    try {
      // Check if item already exists in wishlist
      const existingItemIndex = wishlistItems.findIndex(wishlistItem => wishlistItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already in wishlist, don't add again
        console.log('Item already in wishlist');
        return;
      }

      // Add item to wishlist
      setWishlistItems(prevItems => [...prevItems, item]);

      // If user is authenticated, sync with backend (future enhancement)
      if (isAuthenticated && user) {
        try {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              productId: item.id,
            }),
          });
        } catch (error) {
          console.error('Error syncing wishlist with backend:', error);
          // Continue with local storage even if backend sync fails
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    setIsLoading(true);
    try {
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));

      // If user is authenticated, sync with backend (future enhancement)
      if (isAuthenticated && user) {
        try {
          await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              productId: id,
            }),
          });
        } catch (error) {
          console.error('Error syncing wishlist removal with backend:', error);
          // Continue with local storage even if backend sync fails
        }
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (id: string): boolean => {
    return wishlistItems.some(item => item.id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    const storageKey = isAuthenticated && user ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.removeItem(storageKey);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      wishlistCount, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
