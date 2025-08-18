'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import Link from 'next/link';

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  orderItems?: OrderItem[];
  items?: OrderItem[];
  address?: Address;
}

interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  products?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: 'HOME',
    street: '',
    city: '',
    state: 'Odisha',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
      });
    }
  }, [user]);

  // Load data based on active tab
  useEffect(() => {
    if (user?.id) {
      if (activeTab === 'orders') {
        loadOrders();
      } else if (activeTab === 'addresses') {
        loadAddresses();
      } else if (activeTab === 'wishlist') {
        loadWishlist();
      }
    }
  }, [user?.id, activeTab]);

  const loadOrders = async () => {
    if (!user?.id) return;

    setLoadingOrders(true);
    try {
      const response = await fetch(`/api/customer-orders?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadAddresses = async () => {
    if (!user?.id) return;

    setLoadingAddresses(true);
    try {
      const response = await fetch(`/api/addresses?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadWishlist = async () => {
    if (!user?.id) return;

    setLoadingWishlist(true);
    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };



  const handleProfileUpdate = async () => {
    if (!user?.id) {
      alert('User ID not found. Please log in again.');
      return;
    }

    console.log('Updating profile with data:', {
      userId: user.id,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('✅ Profile updated successfully:', updatedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('❌ Profile update failed:', errorData);
        alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'pending_assignment':
        return 'text-yellow-600 bg-yellow-50';
      case 'in_progress':
      case 'assigned':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-dark-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-dark-700 border-b border-primary-200/20">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary-300/30">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-8 h-8 text-primary-200" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-primary-100">{user.name}</h1>
                  <p className="text-primary-200/80">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-primary-200 hover:text-primary-100 border border-primary-200/30 rounded-lg hover:bg-primary-100/10 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-dark-700 border-r border-primary-200/20">
            <nav className="p-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-4 text-left transition-colors mb-2 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-100 border-l-4 border-primary-400 font-medium'
                        : 'text-primary-200/80 hover:bg-primary-100/10 hover:text-primary-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-dark-800">
            <div className="p-8">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="text-center mb-8">
                    <FiPackage className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-primary-100 mb-2">Your Orders</h2>
                    <p className="text-primary-200/80">View and track your order history</p>
                    <button className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      View Orders
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                      <p className="mt-2 text-primary-200/80">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-primary-200/80">No orders found</p>
                      <Link
                        href="/products"
                        className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mt-4"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-primary-200/20 bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-primary-100">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-primary-200/80">
                                <FiCalendar className="inline w-4 h-4 mr-1" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary-100">{formatPrice(order.totalAmount)}</p>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {(order.orderItems || order.items) && (
                            <div className="border-t border-primary-200/20 pt-3">
                              <p className="text-sm text-primary-200/80 mb-2">Items:</p>
                              <div className="space-y-1">
                                {(order.orderItems || order.items)?.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span className="text-primary-200">
                                      {item.product?.name || item.productName} × {item.quantity}
                                    </span>
                                    <span className="text-primary-300">{formatPrice(item.total || (item.unitPrice * item.quantity))}</span>
                                  </div>
                                ))}
                                {(order.orderItems || order.items)?.length > 3 && (
                                  <p className="text-sm text-primary-200/60">
                                    +{(order.orderItems || order.items).length - 3} more items
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-primary-200/20">
                            <Link
                              href={`/order-details/${order.orderNumber}`}
                              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                            >
                              View Details
                            </Link>
                            {order.status.toLowerCase() === 'delivered' && (
                              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="text-center mb-8">
                    <FiMapPin className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-primary-100 mb-2">Your Addresses</h2>
                    <p className="text-primary-200/80">Manage your delivery addresses</p>
                  </div>

                  {loadingAddresses ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                      <p className="mt-2 text-primary-200/80">Loading addresses...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-primary-200/80">No addresses found</p>
                      <p className="text-sm text-primary-200/60 mt-2">Addresses from your orders will appear here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-primary-200/20 bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-primary-100">{address.type}</h3>
                              {address.isDefault && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-primary-200/80 space-y-1">
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.postalCode}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="text-center mb-8">
                    <FiHeart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-primary-100 mb-2">Your Wishlist</h2>
                    <p className="text-primary-200/80">Save items for later</p>
                  </div>

                  {loadingWishlist ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                      <p className="mt-2 text-primary-200/80">Loading wishlist...</p>
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-primary-200/80">Your wishlist is empty</p>
                      <Link
                        href="/products"
                        className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mt-4"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => {
                        const product = item.product || item.products;
                        return (
                          <div key={item.id} className="border border-primary-200/20 bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                            <div className="aspect-square bg-dark-600 rounded-lg mb-3 overflow-hidden">
                              {product?.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary-300">
                                  <FiPackage className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold text-primary-100 mb-1">{product?.name}</h3>
                            <p className="text-primary-300 font-semibold mb-3">{formatPrice(product?.price || 0)}</p>
                            <div className="flex space-x-2">
                              <Link
                                href={`/product/${product?.id}`}
                                className="flex-1 bg-primary-500 text-white text-center py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                              >
                                View Product
                              </Link>
                              <button className="px-3 py-2 border border-primary-200/30 rounded-lg hover:bg-primary-100/10 transition-colors">
                                <FiTrash2 className="w-4 h-4 text-primary-200" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  {user?.id?.startsWith('google-') && (
                    <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-yellow-400 font-medium">Account Setup Required</h3>
                          <p className="text-yellow-300/80 text-sm mt-1">
                            Your Google account needs to be properly set up in our database. Click "Fix Account" to complete the setup.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-primary-100">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 text-primary-200 hover:text-primary-100 border border-primary-200/30 rounded-lg hover:bg-primary-100/10 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleProfileUpdate}
                          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                        >
                          <FiSave className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-primary-200 hover:text-primary-100 border border-primary-200/30 rounded-lg hover:bg-primary-100/10 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-primary-200 mb-3">
                        Full Name *
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-dark-800 bg-gray-100"
                          placeholder="Your Name"
                        />
                      ) : (
                        <p className="text-primary-100 py-3">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-200 mb-3">
                        Email Address *
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-dark-800 bg-gray-100"
                          placeholder="Email Address"
                        />
                      ) : (
                        <p className="text-primary-100 py-3">{user.email}</p>
                      )}
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-primary-200 mb-3">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-dark-800 bg-gray-100"
                          placeholder="Phone Number"
                        />
                      ) : (
                        <p className="text-primary-100 py-3">{(user as any).phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <div className="text-center py-12">
                    <FiSettings className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-primary-100 mb-2">Account Settings</h3>
                    <p className="text-primary-200/80">Manage your account preferences and security settings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
