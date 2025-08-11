'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  imageUrl?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductsByCategory = async (categorySlug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?categoryId=${categorySlug}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    fetchProductsByCategory(categorySlug);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Category Filtering Test</h1>
      
      {/* Categories List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Categories:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCategory === category.slug
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCategorySelect(category.slug)}
            >
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-600">Slug: {category.slug}</p>
              <p className="text-sm text-gray-500">{category.productCount} products</p>
              <Link 
                href={`/category/${category.slug}`}
                className="text-xs text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                → View Category Page
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Category Products */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Products in "{categories.find(c => c.slug === selectedCategory)?.name}" category:
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                  <Link 
                    href={`/product/${product.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    → View Product
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-600">No products found in this category</p>
            </div>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">🔍 Debug Information:</h3>
        <div className="text-sm space-y-1">
          <p><strong>Total Categories:</strong> {categories.length}</p>
          <p><strong>Selected Category:</strong> {selectedCategory || 'None'}</p>
          <p><strong>Products Found:</strong> {products.length}</p>
          <p><strong>API Endpoints:</strong></p>
          <ul className="ml-4 list-disc">
            <li>Categories: <code>/api/categories</code></li>
            <li>Products: <code>/api/products?categoryId={selectedCategory}</code></li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
        <Link 
          href="/products"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          All Products
        </Link>
      </div>
    </div>
  );
}
