'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DebugCouponIssue() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runDebug = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Test coupon validation with the specific customer and coupon
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: 'TEST175486863147G',
          customerId: session?.user?.customerId || session?.user?.id,
          orderAmount: 500,
        }),
      });

      const result = await response.json();
      
      setDebugInfo({
        session: {
          status,
          user: session?.user,
          customerId: session?.user?.customerId,
          userId: session?.user?.id,
        },
        couponValidation: {
          success: response.ok,
          status: response.status,
          result,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 Debug Coupon Issue
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify({
                status,
                user: session?.user,
                customerId: session?.user?.customerId,
                userId: session?.user?.id,
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Coupon Validation</h2>
          <p className="text-gray-600 mb-4">
            Testing coupon: <strong>TEST175486863147G</strong><br/>
            Customer: <strong>vaishnavibhardwaj401@gmail.com</strong><br/>
            Order Amount: <strong>₹500</strong>
          </p>
          
          <button
            onClick={runDebug}
            disabled={loading || status !== 'authenticated'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Coupon Validation'}
          </button>
          
          {status !== 'authenticated' && (
            <p className="text-red-600 mt-2">
              Please log in with Google first to test coupon validation.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {debugInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="text-yellow-800 font-semibold mb-2">Instructions:</h3>
          <ol className="text-yellow-700 list-decimal list-inside space-y-1">
            <li>Make sure you're logged in with Google using vaishnavibhardwaj401@gmail.com</li>
            <li>Click "Test Coupon Validation" to see what happens</li>
            <li>Check the debug results to see the exact error</li>
            <li>Share the results with the developer</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
