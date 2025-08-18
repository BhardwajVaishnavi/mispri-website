'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiEye, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  orderNumber?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }>;
  address?: {
    city: string;
    state: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, router]);

  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching orders for email:', user.email);
      const response = await fetch(`/api/customer-orders?email=${encodeURIComponent(user.email)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const ordersData = await response.json();
      console.log('✅ Orders fetched:', ordersData.length);
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'CONFIRMED': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'PREPARING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'PENDING_ASSIGNMENT': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'ASSIGNED': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'IN_PROGRESS': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'REFUNDED': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-primary-200/20 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
                  <div className="h-4 bg-primary-200/20 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-primary-200/20 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-primary-200/20 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <FiPackage size={48} className="mx-auto mb-2" />
              <p className="text-lg font-medium">Failed to load orders</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={fetchOrders}
              className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-100">My Orders</h1>
            <p className="text-primary-200/80 mt-1">Track and manage your orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center space-x-2 text-primary-300 hover:text-primary-200 border border-primary-200/30 rounded-lg px-4 py-2 hover:bg-primary-100/10 transition-colors"
          >
            <FiRefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage size={64} className="mx-auto text-primary-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary-200 mb-4">No Orders Yet</h2>
            <p className="text-primary-200/80 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-dark-700 rounded-lg shadow-md overflow-hidden border border-primary-200/20">
                {/* Order Header */}
                <div className="bg-dark-600 px-6 py-4 border-b border-primary-200/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-2 md:mb-0">
                      <div>
                        <h3 className="font-semibold text-primary-100">
                          Order #{order.orderNumber || order.id}
                        </h3>
                        <p className="text-sm text-primary-200/80">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-dark-600 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.imageUrl || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-100 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-primary-200/80">
                            Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-primary-200/60">
                        +{order.orderItems.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Total and Actions */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-primary-200/20">
                    <div className="mb-4 md:mb-0">
                      <p className="text-lg font-bold text-primary-100">
                        Total: ₹{order.totalAmount.toFixed(2)}
                      </p>
                      {order.address && (
                        <p className="text-sm text-primary-200/80">
                          Delivering to {order.address.city}, {order.address.state}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        href={`/order-details/${order.orderNumber || order.id}`}
                        className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                      >
                        <FiEye size={16} />
                        <span>View Details</span>
                      </Link>

                      <button className="flex items-center space-x-2 bg-dark-600 text-primary-200 px-4 py-2 rounded-md hover:bg-dark-500 border border-primary-200/30 transition-colors">
                        <FiDownload size={16} />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
