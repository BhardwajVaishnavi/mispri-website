'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiHeart, FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    category: string;
    productImages?: {
      url: string;
      isMain: boolean;
    }[];
  };
  isBestSeller?: boolean;
};

export default function ProductCard({ product, isBestSeller = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const imageUrl =
    product.productImages && product.productImages.length > 0
      ? product.productImages.find(img => img.isMain)?.url || product.productImages[0].url
      : product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
    });

    // Show added to cart feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-product transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Best Seller Badge */}
          {isBestSeller && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
              Best Seller
            </div>
          )}

          {/* Quick Actions - Visible on Hover */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              className="bg-white text-primary-600 p-2 rounded-full hover:bg-primary-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <FiHeart size={18} />
            </button>
            <button
              className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors"
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              {addedToCart ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center text-yellow-400 mb-2">
          <FiStar className="fill-current" size={14} />
          <FiStar className="fill-current" size={14} />
          <FiStar className="fill-current" size={14} />
          <FiStar className="fill-current" size={14} />
          <FiStar className="text-gray-300" size={14} />
          <span className="text-xs text-gray-500 ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <p className="font-bold text-gray-900">₹{product.price.toFixed(2)}</p>

          {/* Add to Cart Button - Visible on Mobile */}
          <button
            className="md:hidden bg-primary-50 text-primary-600 p-2 rounded-full hover:bg-primary-100 transition-colors"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            {addedToCart ? <FiCheck size={16} /> : <FiShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
