'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Metadata is moved to layout.tsx since this is a client component
// title: 'My Account - Bakery Shop',
// description: 'Manage your account and view your orders'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Load customer data
  useEffect(() => {
    if (user && isAuthenticated) {
      loadCustomerData();
    }
  }, [user, isAuthenticated]);

  const loadCustomerData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load customer profile
      const profileResponse = await fetch(`/api/customer-profile/${user.id}`);
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setCustomerProfile(profile);
      }

      // Load orders
      const ordersResponse = await fetch(`/api/customer-orders?userId=${user.id}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      // Load addresses
      const addressesResponse = await fetch(`/api/addresses?userId=${user.id}`);
      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json();
        setAddresses(addressesData);
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear all local storage and session data
      localStorage.clear();
      sessionStorage.clear();
      // Force redirect and prevent back navigation
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: customerProfile?.phone || '',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile updated successfully');

        // Reload customer data to get updated info
        await loadCustomerData();
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('❌ Profile update failed:', errorData);
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        console.log('✅ Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('Password changed successfully!');
      } else {
        const errorData = await response.json();
        console.error('❌ Password change failed:', errorData);
        alert(errorData.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('❌ Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

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
                onClick={handleLogout}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={handleEditProfile}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  // Display Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="w-full border rounded-md px-3 py-2 bg-gray-50">
                          {user?.name || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="w-full border rounded-md px-3 py-2 bg-gray-50">
                          {user?.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="w-full border rounded-md px-3 py-2 bg-gray-50">
                          {customerProfile?.phone || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
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
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
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
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          minLength={6}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                      >
                        {isSaving ? 'Changing...' : 'Change Password'}
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
                  <div className="bg-white border rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't placed any orders yet. Start shopping to see your order history here.
                    </p>
                    <Link
                      href="/products"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-wrap justify-between mb-4">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber || order.id}</p>
                            <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          <ul className="space-y-1 mb-4">
                            {order.orderItems?.map((item: any, index: number) => (
                              <li key={index} className="text-sm">
                                {item.quantity} x {item.product?.name || 'Product'}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between">
                            <p className="font-medium">Total:</p>
                            <p className="font-medium">₹{order.totalAmount?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Future: When orders exist, show them here */}
            {false && (
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

            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">My Wishlist</h2>
                  <Link
                    href="/wishlist"
                    className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    View Full Wishlist
                  </Link>
                </div>
                <p className="text-gray-600 mb-4">
                  Save items you love to your wishlist and shop them later.
                </p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
                <div className="bg-white border rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-600 mb-6">
                    Add your delivery addresses to make checkout faster and easier.
                  </p>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Add Your First Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
