'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function FixAccount() {
  const { data: session, status } = useSession();
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const fixAccount = async () => {
    if (!session?.user) {
      setError('Please log in first');
      return;
    }

    setFixing(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/fix-google-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        // Sign out and back in to refresh the session
        setTimeout(() => {
          signOut({ callbackUrl: '/' });
        }, 3000);
      } else {
        setError(data.error || 'Failed to fix account');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔧 Fix Google Account
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Session</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <pre className="text-sm overflow-auto">
              {JSON.stringify({
                status,
                user: session?.user,
              }, null, 2)}
            </pre>
          </div>
          
          {session?.user?.id?.startsWith('google-') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <h3 className="text-yellow-800 font-semibold">⚠️ Issue Detected</h3>
              <p className="text-yellow-700">
                Your account has a temporary ID ({session.user.id}) which means it's not properly stored in the database.
                This is why coupons are not working.
              </p>
            </div>
          )}
          
          <button
            onClick={fixAccount}
            disabled={fixing || status !== 'authenticated'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {fixing ? 'Fixing Account...' : 'Fix My Account'}
          </button>
          
          {status !== 'authenticated' && (
            <p className="text-red-600 mt-2">
              Please log in with Google first.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">❌ Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold">✅ Account Fixed!</h3>
            <p className="text-green-700 mb-2">
              Your account has been properly created in the database.
            </p>
            <div className="bg-white p-3 rounded border">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            <p className="text-green-700 mt-2">
              You will be signed out in 3 seconds. Please sign back in to use the new account.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">📋 Instructions:</h3>
          <ol className="text-blue-700 list-decimal list-inside space-y-1">
            <li>Make sure you're logged in with Google</li>
            <li>Click "Fix My Account" to create a proper database record</li>
            <li>You'll be signed out automatically</li>
            <li>Sign back in with Google</li>
            <li>Try using coupons again - they should work now!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
