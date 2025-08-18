'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NextAuth Session */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">NextAuth Session</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
            {session && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Session Data:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* AuthContext */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">AuthContext</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Has User:</strong> {user ? 'Yes' : 'No'}</p>
            {user && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">User Data:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Environment</h2>
          <div className="space-y-2">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                fetch('/api/auth/check-user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: session?.user?.email }),
                })
                .then(res => res.json())
                .then(data => {
                  console.log('Check user result:', data);
                  alert('Check console for result');
                })
                .catch(err => {
                  console.error('Check user error:', err);
                  alert('Error - check console');
                });
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!session?.user?.email}
            >
              Test Check User API
            </button>

            <button
              onClick={() => {
                console.log('Current session:', session);
                console.log('Current user:', user);
                console.log('Auth state:', { isAuthenticated, isLoading });
                alert('Check console for current state');
              }}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Log Current State
            </button>
          </div>
        </div>
      </div>

      {/* Raw Data */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Raw Data</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">NextAuth Session:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify({ session, status }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">AuthContext State:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify({ user, isAuthenticated, isLoading }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
