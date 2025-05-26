'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  const moveToCart = async (item: any) => {
    setMovingToCart(item.id);
    try {
      // Add to cart
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });

      // Remove from wishlist
      await removeFromWishlist(item.id);

      // Show success message
      alert('Item moved to cart successfully!');
    } catch (error) {
      console.error('Error moving item to cart:', error);
      alert('Failed to move item to cart. Please try again.');
    } finally {
      setMovingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="flex items-center text-gray-600">
          <FiHeart className="mr-2" />
          <span>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <Link href="/login" className="font-medium hover:underline">
              Sign in
            </Link>{' '}
            to sync your wishlist across devices and save it permanently.
          </p>
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FiHeart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-2">Your wishlist is empty</p>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist</p>
          <Link
            href="/products"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 relative flex-shrink-0 mr-4">
                        <Image
                          src={item.image || `https://picsum.photos/seed/${item.id}/200/200`}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="text-gray-900 font-medium hover:text-primary-600"
                        >
                          {item.name}
                        </Link>
                        {item.category && (
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        className={`text-primary-600 hover:text-primary-800 flex items-center transition-colors ${
                          (!item.inStock || movingToCart === item.id) && 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => item.inStock && moveToCart(item)}
                        disabled={!item.inStock || movingToCart === item.id}
                      >
                        {movingToCart === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-1"></div>
                        ) : (
                          <FiShoppingCart className="mr-1" />
                        )}
                        <span className="text-sm">
                          {movingToCart === item.id ? 'Moving...' : 'Add to Cart'}
                        </span>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={isLoading}
                      >
                        <FiTrash2 className="mr-1" />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/products"
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
