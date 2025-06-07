'use client';

import { useState } from 'react';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    unit?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    // Show added to cart feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
          <button
            className="p-2 sm:p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              const clampedValue = Math.max(1, Math.min(99, value));
              setQuantity(clampedValue);
            }}
            min={1}
            max={99}
            className="w-12 sm:w-16 px-2 sm:px-3 py-2 sm:py-3 text-center font-medium text-gray-900 border-0 focus:outline-none focus:ring-0 text-sm sm:text-base"
            aria-label="Quantity"
          />
          <button
            className="p-2 sm:p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
            onClick={increaseQuantity}
            disabled={quantity >= 99}
            aria-label="Increase quantity"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-xs sm:text-sm text-gray-600">({product.unit || 'piece'})</span>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`w-full ${
          addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
        } text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm sm:text-base`}
        onClick={handleAddToCart}
      >
        {addedToCart ? (
          <>
            <FiCheck className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Added to Cart</span>
            <span className="sm:hidden">Added</span>
          </>
        ) : (
          <>
            <FiShoppingCart className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}
