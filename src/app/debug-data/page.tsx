'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
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

  // Debug orders in database
  const debugOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Debugging orders...');
      const response = await fetch('/api/debug-orders');

      console.log('📡 Debug orders response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Debug orders failed:', errorData);
        throw new Error(errorData.error || 'Failed to debug orders');
      }

      const data = await response.json();
      console.log('✅ Debug orders successful:', data);
      setResult({ action: 'debug-orders', success: true, data });
    } catch (err: any) {
      console.error('❌ Debug orders error:', err);
      setError(err.message || 'Failed to debug orders');
      setResult({ action: 'debug-orders', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test specific order lookup
  const testOrderLookup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const orderNumber = 'ORD-1753966092851-166';
      console.log('🔄 Testing order lookup for:', orderNumber);
      
      const response = await fetch(`/api/orders/by-number/${orderNumber}`);

      console.log('📡 Order lookup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Order lookup failed:', errorData);
        throw new Error(errorData.error || 'Order not found');
      }

      const data = await response.json();
      console.log('✅ Order lookup successful:', data);
      setResult({ action: 'order-lookup', success: true, data, orderNumber });
    } catch (err: any) {
      console.error('❌ Order lookup error:', err);
      setError(err.message || 'Failed to lookup order');
      setResult({ action: 'order-lookup', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test cart functionality
  const testCart = async () => {
    if (!user?.id) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testing cart for user:', user.id);
      
      const response = await fetch(`/api/cart?userId=${user.id}`);

      console.log('📡 Cart response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Cart fetch failed:', errorData);
        throw new Error(errorData.error || 'Failed to fetch cart');
      }

      const data = await response.json();
      console.log('✅ Cart fetch successful:', data);
      setResult({ action: 'cart-test', success: true, data });
    } catch (err: any) {
      console.error('❌ Cart test error:', err);
      setError(err.message || 'Failed to test cart');
      setResult({ action: 'cart-test', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test database connection
  const testDatabase = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Testing database connection...');

      const response = await fetch('/api/debug-database');

      console.log('📡 Database test response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Database test failed:', errorData);
        throw new Error(errorData.error || 'Database test failed');
      }

      const data = await response.json();
      console.log('✅ Database test successful:', data);
      setResult({ action: 'database-test', success: true, data });
    } catch (err: any) {
      console.error('❌ Database test error:', err);
      setError(err.message || 'Failed to test database');
      setResult({ action: 'database-test', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Create test order
  const createTestOrder = async () => {
    if (!user?.id) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Creating test order...');

      const response = await fetch('/api/create-test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      console.log('📡 Create test order response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Create test order failed:', errorData);
        throw new Error(errorData.error || 'Failed to create test order');
      }

      const data = await response.json();
      console.log('✅ Test order created successfully:', data);
      setResult({ action: 'create-test-order', success: true, data });
    } catch (err: any) {
      console.error('❌ Create test order error:', err);
      setError(err.message || 'Failed to create test order');
      setResult({ action: 'create-test-order', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Data Issues</h1>
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Database Test</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Test database connection and basic queries
          </p>
          <button
            onClick={testDatabase}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Database'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Orders</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Check what orders exist in the database
          </p>
          <button
            onClick={debugOrders}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Debugging...' : 'Debug Orders'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Test Order Lookup</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Test looking up specific order: ORD-1753966092851-166
          </p>
          <button
            onClick={testOrderLookup}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Order Lookup'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Test Cart</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Test cart functionality and CORS issues
          </p>
          <button
            onClick={testCart}
            disabled={loading || !user}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Cart'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Create Test Order</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Create a test order with sample data for testing
          </p>
          <button
            onClick={createTestOrder}
            disabled={loading || !user}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Creating...' : 'Create Test Order'}
          </button>
        </div>
      </div>
      
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
            {result.action.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} {result.success ? 'Successful' : 'Failed'}
          </p>
          {result.orderNumber && (
            <p className="mt-2 text-sm">
              <strong>Order Number:</strong> {result.orderNumber}
            </p>
          )}
          <pre className="mt-2 text-sm overflow-auto max-h-60 whitespace-pre-wrap">
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Debug Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>First, test database connection to see what data exists</li>
          <li>Create a test order if no orders exist in the database</li>
          <li>Debug orders to see what orders exist in the database</li>
          <li>Test specific order lookup using a real order number</li>
          <li>Test cart functionality to check for CORS issues</li>
          <li>Check browser console for detailed error logs</li>
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
