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
    <div className="flex items-center mb-8">
      <div className="flex items-center border rounded-md mr-4">
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="px-4 py-2">{quantity}</span>
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
      <button 
        className={`${
          addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'
        } text-white font-semibold py-2 px-6 rounded-md flex items-center transition-colors`}
        onClick={handleAddToCart}
      >
        {addedToCart ? (
          <>
            <FiCheck className="mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <FiShoppingCart className="mr-2" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
