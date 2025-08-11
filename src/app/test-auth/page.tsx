'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function TestAuthPage() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    error, 
    clearError,
    sendForgotPasswordOTP,
    verifyOTP,
    resetPassword
  } = useAuth();

  const { data: session, status } = useSession();

  // Login form
  const [loginEmail, setLoginEmail] = useState('customer@example.com');
  const [loginPassword, setLoginPassword] = useState('customer123');

  // Register form
  const [registerName, setRegisterName] = useState('Test User');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('+91 9876543210');
  const [registerPassword, setRegisterPassword] = useState('test123456');

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);

  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    addTestResult(`🔄 Attempting login for: ${loginEmail}`);
    
    const success = await login(loginEmail, loginPassword);
    if (success) {
      addTestResult(`✅ Login successful for: ${loginEmail}`);
    } else {
      addTestResult(`❌ Login failed for: ${loginEmail}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const testEmail = registerEmail || `test-${Date.now()}@example.com`;
    setRegisterEmail(testEmail);
    
    addTestResult(`🔄 Attempting registration for: ${testEmail}`);
    
    const success = await register(registerName, testEmail, registerPassword, registerPhone);
    if (success) {
      addTestResult(`✅ Registration successful for: ${testEmail}`);
    } else {
      addTestResult(`❌ Registration failed for: ${testEmail}`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    addTestResult(`🔄 Sending OTP to: ${forgotEmail}`);
    
    const success = await sendForgotPasswordOTP(forgotEmail);
    if (success) {
      addTestResult(`✅ OTP sent to: ${forgotEmail} (Check console for OTP)`);
      setForgotStep(2);
    } else {
      addTestResult(`❌ Failed to send OTP to: ${forgotEmail}`);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    addTestResult(`🔄 Verifying OTP: ${otpCode}`);
    
    const success = await verifyOTP(forgotEmail, otpCode);
    if (success) {
      addTestResult(`✅ OTP verified successfully`);
      setForgotStep(3);
    } else {
      addTestResult(`❌ OTP verification failed`);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    addTestResult(`🔄 Resetting password`);
    
    const success = await resetPassword(forgotEmail, otpCode, newPassword);
    if (success) {
      addTestResult(`✅ Password reset successful`);
      setForgotStep(1);
      setForgotEmail('');
      setOtpCode('');
      setNewPassword('');
    } else {
      addTestResult(`❌ Password reset failed`);
    }
  };

  const handleLogout = () => {
    logout();
    addTestResult(`🚪 User logged out`);
  };

  const handleGoogleLogin = async () => {
    addTestResult(`🔄 Starting Google OAuth login...`);

    try {
      const result = await signIn('google', {
        callbackUrl: '/test-auth',
        redirect: false,
      });

      if (result?.error) {
        addTestResult(`❌ Google login failed: ${result.error}`);
      } else if (result?.ok) {
        addTestResult(`✅ Google login successful`);
      } else {
        addTestResult(`🔄 Google login redirecting...`);
      }
    } catch (error) {
      addTestResult(`❌ Google login error: ${error}`);
    }
  };

  const handleGoogleLogout = async () => {
    addTestResult(`🔄 Signing out from Google...`);

    try {
      await signOut({ redirect: false });
      addTestResult(`✅ Google logout successful`);
    } catch (error) {
      addTestResult(`❌ Google logout error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Authentication System Test</h1>

      {/* Current User Status */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</span>
          </div>
          <div className="flex items-center">
            <span>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</span>
          </div>
          <div className="flex items-center">
            <span>User: {user ? user.name || user.email : 'None'}</span>
          </div>
          <div className="flex items-center">
            <span>NextAuth Session: {session ? '✅ Active' : '❌ None'}</span>
          </div>
          <div className="flex items-center">
            <span>Session Status: {status}</span>
          </div>
        </div>
        {user && (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <h3 className="font-medium">User Details:</h3>
            <pre className="text-sm mt-2">{JSON.stringify(user, null, 2)}</pre>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔐 Login Test</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Test Login'}
            </button>
          </form>
        </div>

        {/* Register Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📝 Register Test</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Test Register'}
            </button>
          </form>
        </div>

        {/* Google OAuth Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔐 Google OAuth Test</h2>

          {session ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Google Session Active</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  {session.user?.image && (
                    <div className="mt-2">
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleGoogleLogout}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Sign Out from Google
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Test Google OAuth authentication</p>
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="text-sm text-gray-600">
                <p><strong>Note:</strong> Requires Google OAuth setup</p>
                <p>Check console for detailed logs</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Test */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🔑 Forgot Password Test</h2>
        
        {forgotStep === 1 && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter email to reset password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {forgotStep === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">6-Digit OTP</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full border rounded px-3 py-2 text-center font-mono"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-600 mt-1">Check console logs for OTP</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => setForgotStep(1)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {forgotStep === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => setForgotStep(2)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Test Results */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📋 Test Results</h2>
        <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setTestResults([])}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>
    </div>
  );
}
