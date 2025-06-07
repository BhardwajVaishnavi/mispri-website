'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestAPIPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testAPI = async (url: string, label: string) => {
    try {
      console.log(`Testing ${label}:`, url);
      const response = await fetch(url);
      const data = response.ok ? await response.json() : await response.text();
      
      return {
        label,
        url,
        status: response.status,
        success: response.ok,
        data: response.ok ? data : `Error: ${data}`,
        count: Array.isArray(data) ? data.length : 'N/A'
      };
    } catch (error) {
      return {
        label,
        url,
        status: 'ERROR',
        success: false,
        data: error instanceof Error ? error.message : 'Unknown error',
        count: 'N/A'
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    const tests = [
      { url: '/api/public/products', label: 'Website Public Products' },
      { url: '/api/products', label: 'Website Products' },
      { url: 'https://mispri24.vercel.app/api/public/products', label: 'Admin Public Products' },
      { url: 'https://mispri24.vercel.app/api/products', label: 'Admin Products' },
    ];

    const testResults = [];
    for (const test of tests) {
      const result = await testAPI(test.url, test.label);
      testResults.push(result);
      setResults([...testResults]);
    }

    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Testing Page</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{result.label}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {result.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{result.url}</p>
            
            {result.success && (
              <p className="text-sm mb-2">
                <strong>Count:</strong> {result.count}
              </p>
            )}
            
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">
                {result.success ? 'View Data' : 'View Error'}
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                {typeof result.data === 'object' 
                  ? JSON.stringify(result.data, null, 2) 
                  : result.data}
              </pre>
            </details>

            {result.success && Array.isArray(result.data) && result.data.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-sm mb-2">Test Product Links:</p>
                <div className="space-y-1">
                  {result.data.slice(0, 3).map((product: any) => (
                    <div key={product.id} className="text-sm">
                      <Link
                        href={`/product/${product.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {product.name} (ID: {product.id})
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Check which APIs are working (green = success, red = error)</li>
          <li>If products are found, click the product links to test detail pages</li>
          <li>Check browser console for detailed logs</li>
          <li>If all APIs fail, check if admin panel is running</li>
        </ol>
      </div>
    </div>
  );
}
