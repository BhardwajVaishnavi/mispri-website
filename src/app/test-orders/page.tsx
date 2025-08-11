'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function TestOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const { user, login } = useAuth();

  // Auto-login demo user if not logged in
  useEffect(() => {
    if (!user) {
      handleDemoLogin();
    }
  }, [user]);

  const handleDemoLogin = async () => {
    try {
      console.log('🔄 Auto-logging in demo user...');
      await login('customer@example.com', 'customer123');
    } catch (err) {
      console.error('❌ Auto-login failed:', err);
    }
  };

  // Test fetching orders
  const testFetchOrders = async () => {
    if (!user?.id) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing order fetch for user:', user.id);
      const response = await fetch(`/api/customer-orders?userId=${user.id}`);

      console.log('📡 Orders response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Orders fetch failed:', errorData);
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const ordersData = await response.json();
      console.log('✅ Orders fetched successfully:', ordersData);
      setOrders(ordersData);
      setResult({ action: 'fetch-orders', success: true, data: ordersData });
    } catch (err: any) {
      console.error('❌ Orders fetch error:', err);
      setError(err.message || 'Failed to fetch orders');
      setResult({ action: 'fetch-orders', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test creating a sample order
  const testCreateOrder = async () => {
    if (!user?.id) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing order creation...');
      
      // First, get a product to order
      const productsResponse = await fetch('/api/products?limit=1');
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const products = await productsResponse.json();
      if (products.length === 0) {
        throw new Error('No products available');
      }

      const product = products[0];
      console.log('📦 Using product:', product.name);

      const orderData = {
        userId: user.id,
        items: [{
          productId: product.id,
          quantity: 1,
          unitPrice: product.price || 100,
        }],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Bhubaneswar',
          state: 'Odisha',
          pincode: '751001',
          country: 'India',
          firstName: user.firstName || 'Test',
          lastName: user.lastName || 'Customer',
          phone: user.phone || '+91 9876543210',
          email: user.email,
        },
        paymentMethod: 'COD',
        totalAmount: product.price || 100,
        subtotal: product.price || 100,
        shipping: 0,
      };

      const response = await fetch('/api/customer-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('📡 Order creation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();
      console.log('✅ Order created successfully:', order);
      setResult({ action: 'create-order', success: true, data: order });
      
      // Refresh orders list
      setTimeout(() => testFetchOrders(), 1000);
    } catch (err: any) {
      console.error('❌ Order creation error:', err);
      setError(err.message || 'Failed to create order');
      setResult({ action: 'create-order', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test admin panel API directly
  const testAdminAPI = async () => {
    if (!user?.id) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing admin panel API directly...');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
      
      const response = await fetch(`${API_BASE_URL}/customer-orders?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Admin API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Admin API failed:', errorData);
        throw new Error(errorData.error || 'Admin API failed');
      }

      const ordersData = await response.json();
      console.log('✅ Admin API successful:', ordersData);
      setResult({ action: 'admin-api', success: true, data: ordersData });
    } catch (err: any) {
      console.error('❌ Admin API error:', err);
      setError(err.message || 'Admin API test failed');
      setResult({ action: 'admin-api', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders Test</h1>
      
      {/* User Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Status</h2>
        {user ? (
          <div className="mb-4">
            <p className="text-green-600 font-medium">✅ Logged in as: {user.name} ({user.email})</p>
            <p className="text-sm text-gray-600">User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-red-600 mb-4">❌ Not logged in (auto-login in progress...)</p>
        )}
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Fetch Orders</h2>
          <p className="text-gray-600 mb-4">
            Test fetching orders for the current user
          </p>
          <button
            onClick={testFetchOrders}
            disabled={loading || !user}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Fetch Orders'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create Test Order</h2>
          <p className="text-gray-600 mb-4">
            Create a sample order to test the orders system
          </p>
          <button
            onClick={testCreateOrder}
            disabled={loading || !user}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Creating...' : 'Create Test Order'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Admin API</h2>
          <p className="text-gray-600 mb-4">
            Test admin panel API directly (bypassing website API)
          </p>
          <button
            onClick={testAdminAPI}
            disabled={loading || !user}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Admin API'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Orders ({orders.length})</h2>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber || order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {order.orderItems?.length || 0} items
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Result Display */}
      {result && (
        <div className={`bg-${result.success ? 'green' : 'red'}-100 border border-${result.success ? 'green' : 'red'}-400 text-${result.success ? 'green' : 'red'}-700 px-4 py-3 rounded mb-8`}>
          <p className="font-bold">
            {result.action === 'fetch-orders' ? 'Fetch Orders' : result.action === 'create-order' ? 'Create Order' : 'Admin API'} Test {result.success ? 'Successful' : 'Failed'}
          </p>
          <pre className="mt-2 text-sm overflow-auto max-h-60 whitespace-pre-wrap">
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">How to Test</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Wait for auto-login to complete</li>
          <li>Click "Fetch Orders" to see current orders (might be empty initially)</li>
          <li>Click "Create Test Order" to create a sample order</li>
          <li>Click "Fetch Orders" again to see the new order</li>
          <li>Check the actual orders page at <Link href="/orders" className="text-blue-600 hover:underline">/orders</Link></li>
        </ol>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
