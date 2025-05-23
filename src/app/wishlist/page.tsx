'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

// Mock wishlist data
const initialWishlistItems = [
  {
    id: '1',
    name: 'Red Rose Bouquet',
    price: 799,
    image: '/images/flowers/rose_bouquet.jpg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Chocolate Truffle Cake',
    price: 899,
    image: '/images/cakes/chocolate_cake.jpg',
    inStock: true,
  },
  {
    id: '3',
    name: 'Birthday Gift Hamper',
    price: 1499,
    image: '/images/combos/gift_combo.jpg',
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeItem = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const moveToCart = (id: string) => {
    // In a real app, this would call an API to add the item to the cart
    // For now, we'll just remove it from the wishlist
    removeItem(id);
    // Show a success message or redirect to cart
    alert('Item added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
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
                          src={item.image}
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
                        className={`text-primary-600 hover:text-primary-800 flex items-center ${
                          !item.inStock && 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => item.inStock && moveToCart(item.id)}
                        disabled={!item.inStock}
                      >
                        <FiShoppingCart className="mr-1" />
                        <span className="text-sm">Add to Cart</span>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 flex items-center"
                        onClick={() => removeItem(item.id)}
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
