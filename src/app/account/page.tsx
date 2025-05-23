'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';

// Metadata is moved to layout.tsx since this is a client component
// title: 'My Account - Bakery Shop',
// description: 'Manage your account and view your orders'

// Mock user data (in a real app, this would come from a database or state management)
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
};

// Mock orders data
const orders = [
  {
    id: 'ORD123456',
    date: '2023-05-15',
    status: 'Delivered',
    total: 1698,
    items: [
      { name: 'Red Rose Bouquet', quantity: 1 },
      { name: 'Chocolate Truffle Cake', quantity: 1 },
    ],
  },
  {
    id: 'ORD789012',
    date: '2023-04-22',
    status: 'Delivered',
    total: 2499,
    items: [
      { name: 'Birthday Gift Hamper', quantity: 1 },
    ],
  },
];

// Mock addresses
const addresses = [
  {
    id: '1',
    type: 'Home',
    isDefault: true,
    street: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  },
  {
    id: '2',
    type: 'Office',
    isDefault: false,
    street: '456 Business Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <nav className="space-y-1">
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser className="mr-3" />
                Profile
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'orders'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <FiShoppingBag className="mr-3" />
                Orders
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'wishlist'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('wishlist')}
              >
                <FiHeart className="mr-3" />
                Wishlist
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'addresses'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('addresses')}
              >
                <FiMapPin className="mr-3" />
                Addresses
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        defaultValue={user.name}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        defaultValue={user.email}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        defaultValue={user.phone}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-wrap justify-between mb-4">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">Placed on {order.date}</p>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          <ul className="space-y-1 mb-4">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                {item.quantity} x {item.name}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between">
                            <p className="font-medium">Total:</p>
                            <p className="font-medium">₹{order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                          >
                            View Order Details
                          </Link>
                          <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                <p className="text-gray-600">Your wishlist is empty.</p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Addresses</h2>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
                    Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <p className="font-medium mb-1">{address.type}</p>
                      <p className="text-sm text-gray-600">{address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{address.country}</p>
                      <div className="flex space-x-3">
                        <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Delete
                        </button>
                        {!address.isDefault && (
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
