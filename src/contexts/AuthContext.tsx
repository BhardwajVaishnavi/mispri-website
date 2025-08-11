'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, sendForgotPasswordOTP, verifyOTP, resetPassword } from '@/lib/api';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  sendForgotPasswordOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Sync NextAuth session with our auth context
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      // User is logged in via NextAuth (Google)
      const nextAuthUser: User = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        avatar: session.user.image || undefined,
        role: 'CUSTOMER',
        isActive: true,
      };
      setUser(nextAuthUser);
      localStorage.setItem('user', JSON.stringify(nextAuthUser));
    } else {
      // Check localStorage for saved user data (email/password login)
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    }

    setIsLoading(false);
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API
      const result = await loginUser(email, password);

      if (result && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the register API
      const result = await registerUser(name, email, password, phone);

      if (result && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');

      // Clear user state
      setUser(null);

      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();

      // If user was logged in via NextAuth (Google), sign them out
      if (session) {
        console.log('🔄 Signing out from NextAuth...');
        await signOut({ redirect: false });
      }

      // Clear any cookies related to authentication
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

      console.log('✅ Logout completed successfully');

    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if there's an error, clear local state
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const sendForgotPasswordOTPHandler = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendForgotPasswordOTP(email);
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPHandler = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(email, otp);
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordHandler = async (email: string, otp: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(email, otp, password);
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      error,
      clearError,
      sendForgotPasswordOTP: sendForgotPasswordOTPHandler,
      verifyOTP: verifyOTPHandler,
      resetPassword: resetPasswordHandler
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
