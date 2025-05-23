'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { FiUser, FiPackage, FiHeart, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  onLoginClick: () => void;
}

export default function UserMenu({ onLoginClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {isAuthenticated ? (
        <button
          className="flex items-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <FaUser className="text-gray-500" />
            )}
          </div>
        </button>
      ) : (
        <button
          className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
          onClick={onLoginClick}
        >
          <FaUser className="mr-1" />
          <span>Sign In</span>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && isAuthenticated && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="font-medium text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <Link 
            href="/account" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FiUser className="mr-3 text-gray-400" />
            My Account
          </Link>
          
          <Link 
            href="/orders" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FiPackage className="mr-3 text-gray-400" />
            My Orders
          </Link>
          
          <Link 
            href="/wishlist" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FiHeart className="mr-3 text-gray-400" />
            Wishlist
          </Link>
          
          <Link 
            href="/account/settings" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FiSettings className="mr-3 text-gray-400" />
            Settings
          </Link>
          
          <div className="border-t my-1"></div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiLogOut className="mr-3 text-gray-400" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
