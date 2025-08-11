'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestOrderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [setupStatus, setSetupStatus] = useState<any>(null);

  // Setup demo data
  const handleSetupDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Setting up demo data locally...');
      const response = await fetch('/api/test-local-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Setup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Setup failed:', errorData);
        throw new Error(errorData.error || 'Setup failed');
      }

      const data = await response.json();
      console.log('✅ Setup successful:', data);
      setSetupStatus(data);
      setResult({ action: 'setup', success: true, data });
    } catch (err) {
      console.error('❌ Setup error:', err);
      setError(err.message || 'Setup failed');
      setResult({ action: 'setup', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Test local database
  const handleTestLocalDB = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Testing local database...');
      const response = await fetch('/api/test-local-db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Test response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Test failed:', errorData);
        throw new Error(errorData.error || 'Test failed');
      }

      const data = await response.json();
      console.log('✅ Test successful:', data);
      setResult({ action: 'test-db', success: true, data });
    } catch (err) {
      console.error('❌ Test error:', err);
      setError(err.message || 'Test failed');
      setResult({ action: 'test-db', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Load user and products on mount
  useEffect(() => {
    const loadData = async () => {
      // Try to get user from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }

      // Load products
      try {
        const response = await fetch('/api/products?limit=5');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          if (data.length > 0) {
            setSelectedProduct(data[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      }
    };

    loadData();
  }, []);

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Attempting login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@example.com',
          password: 'customer123',
        }),
      });

      console.log('📡 Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setResult({ action: 'login', success: true, data: data.user });
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      setResult({ action: 'login', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestOrder = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const product = products.find(p => p.id === selectedProduct);
      
      const orderData = {
        userId: user.id,
        items: [{
          productId: selectedProduct,
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
        },
        paymentMethod: 'COD',
        totalAmount: product.price || 100,
        subtotal: product.price || 100,
        shipping: 0,
      };

      console.log('📦 Order Data:', orderData);

      const response = await fetch('/api/customer-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('📡 API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);

        let errorMessage = 'Failed to create order';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const order = await response.json();
      console.log('✅ Order Created Successfully:', order);
      setResult({ action: 'order', success: true, data: order });
    } catch (err) {
      setError(err.message || 'Order creation failed');
      setResult({ action: 'order', success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Creation Test</h1>

      {/* Setup Demo Data */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Demo Data</h2>
        <p className="text-gray-700 mb-4">
          If you're getting "User not found" errors, click this button to set up the demo customer and sample data.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleTestLocalDB}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Local Database'}
          </button>
          <button
            onClick={handleSetupDemo}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Setting up...' : 'Setup Demo Data'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Status</h2>
        {user ? (
          <div className="mb-4">
            <p className="text-green-600 font-medium">✅ Logged in as: {user.name} ({user.email})</p>
            <p className="text-sm text-gray-600">User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-red-600 mb-4">❌ Not logged in</p>
        )}
        
        {!user && (
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Logging in...' : 'Test Login'}
          </button>
        )}
      </div>
      
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Test Order</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleTestOrder}
            disabled={loading || !selectedProduct}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            {loading ? 'Creating Order...' : 'Create Test Order'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className={`bg-${result.success ? 'green' : 'red'}-100 border border-${result.success ? 'green' : 'red'}-400 text-${result.success ? 'green' : 'red'}-700 px-4 py-3 rounded mb-8`}>
          <p className="font-bold">{result.action === 'login' ? 'Login' : 'Order Creation'} {result.success ? 'Successful' : 'Failed'}</p>
          <pre className="mt-2 text-sm overflow-auto max-h-60">
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
