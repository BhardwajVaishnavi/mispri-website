'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiDownload, FiTruck, FiMapPin, FiPhone, FiMail, FiPackage, FiSend, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  subtotal?: number;
  shipping?: number;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      id: string;
      name: string;
      imageUrl?: string;
    };
  }>;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();

  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [isAuthenticated, orderNumber, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching order details for:', orderNumber);

      const response = await fetch(`/api/orders/by-number/${orderNumber}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order details');
      }

      const orderData = await response.json();
      console.log('✅ Order details fetched:', orderData);

      // Transform and validate the order data
      const transformedOrder: OrderDetails = {
        id: orderData.id,
        orderNumber: orderData.orderNumber || orderData.id,
        status: orderData.status || 'PENDING',
        paymentStatus: orderData.paymentStatus || 'PENDING',
        totalAmount: Number(orderData.totalAmount) || 0,
        subtotal: Number(orderData.subtotal) || Number(orderData.totalAmount) || 0,
        shipping: Number(orderData.shipping) || 0,
        createdAt: orderData.createdAt || new Date().toISOString(),
        orderItems: orderData.orderItems?.map((item: any) => ({
          id: item.id,
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
          product: {
            id: item.product?.id || '',
            name: item.product?.name || 'Unknown Product',
            imageUrl: item.product?.imageUrl || '/placeholder-product.svg',
          }
        })) || [],
        address: orderData.address ? {
          street: orderData.address.street || '',
          city: orderData.address.city || '',
          state: orderData.address.state || '',
          postalCode: orderData.address.postalCode || '',
          country: orderData.address.country || 'India',
        } : undefined,
        customer: orderData.customer ? {
          firstName: orderData.customer.firstName || '',
          lastName: orderData.customer.lastName || '',
          phone: orderData.customer.phone || '',
        } : undefined,
      };

      // Calculate subtotal if not provided
      if (!transformedOrder.subtotal && transformedOrder.orderItems.length > 0) {
        transformedOrder.subtotal = transformedOrder.orderItems.reduce(
          (sum, item) => sum + (item.unitPrice * item.quantity), 0
        );
      }

      setOrderDetails(transformedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      console.error('❌ Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_ASSIGNMENT': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDownloadInvoice = () => {
    if (!orderDetails) return;

    // Create a printable invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the invoice');
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #5F9EA0; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #5F9EA0; margin-bottom: 5px; }
          .company-tagline { font-size: 14px; color: #666; }
          .invoice-details { display: flex; justify-content: space-between; margin: 30px 0; }
          .invoice-info, .customer-info { flex: 1; }
          .invoice-info { margin-right: 20px; }
          .section-title { font-size: 16px; font-weight: bold; color: #5F9EA0; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; color: #5F9EA0; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .thank-you { font-size: 18px; color: #5F9EA0; font-weight: bold; margin-bottom: 10px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">MISPRI</div>
          <div class="company-tagline">Bakery & Flower Shop • Bhubaneswar, Odisha</div>
        </div>

        <div class="invoice-details">
          <div class="invoice-info">
            <div class="section-title">Invoice Details</div>
            <p><strong>Order Number:</strong> #${orderNumber}</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</p>
            <p><strong>Order Status:</strong> ${orderDetails.status}</p>
          </div>
          <div class="customer-info">
            <div class="section-title">Delivery Address</div>
            ${orderDetails.address ? `
              <p><strong>${orderDetails.customer?.firstName || ''} ${orderDetails.customer?.lastName || ''}</strong></p>
              <p>${orderDetails.address.street}</p>
              <p>${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.postalCode}</p>
              ${orderDetails.customer?.phone ? `<p>Phone: ${orderDetails.customer.phone}</p>` : ''}
            ` : '<p>Address not available</p>'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.orderItems.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.unitPrice.toFixed(2)}</td>
                <td>₹${(item.unitPrice * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
              <td><strong>₹${(orderDetails.subtotal || orderDetails.totalAmount).toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
              <td><strong>₹${(orderDetails.shipping || 0).toFixed(2)}</strong></td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
              <td><strong>₹${orderDetails.totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="footer">
          <div class="thank-you">Thank you for your business!</div>
          <p>This is a computer-generated invoice for Order #${orderNumber}</p>
          <p>For any queries, contact us at support@mispri.com</p>
          <p>Visit us at: www.mispri.com</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const handleSendEmail = async () => {
    if (!orderDetails || !user?.email) {
      setEmailError('Order details or user email not available');
      return;
    }

    setEmailSending(true);
    setEmailError(null);

    try {
      console.log('📧 Sending order details email...');

      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: orderDetails.orderNumber,
          customerEmail: user.email,
          customerName: user.name || `${orderDetails.customer?.firstName} ${orderDetails.customer?.lastName}`.trim(),
          orderDetails: orderDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      const result = await response.json();
      console.log('✅ Email sent successfully:', result);

      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000); // Reset after 5 seconds
    } catch (err) {
      console.error('❌ Email sending failed:', err);
      setEmailError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <FiPackage size={48} className="mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load order details</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={fetchOrderDetails}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/orders"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors inline-block"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FiPackage size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-600">Order not found</p>
          <Link
            href="/orders"
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/orders"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft size={20} />
            <span>Back to Orders</span>
          </Link>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSendEmail}
            disabled={emailSending || !user?.email}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {emailSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : emailSent ? (
              <FiCheck size={16} />
            ) : (
              <FiSend size={16} />
            )}
            <span>
              {emailSending ? 'Sending...' : emailSent ? 'Email Sent!' : 'Email Details'}
            </span>
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <FiDownload size={16} />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* Email Status */}
      {(emailSent || emailError) && (
        <div className={`rounded-lg p-4 mb-6 ${emailSent ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${emailSent ? 'bg-green-100' : 'bg-red-100'}`}>
              {emailSent ? (
                <FiCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FiMail className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div>
              <p className={`font-medium ${emailSent ? 'text-green-800' : 'text-red-800'}`}>
                {emailSent ? 'Order details sent successfully!' : 'Failed to send email'}
              </p>
              <p className={`text-sm ${emailSent ? 'text-green-600' : 'text-red-600'}`}>
                {emailSent ? `Order details have been sent to ${user?.email}` : emailError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{orderDetails.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
              {orderDetails.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
              {orderDetails.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderDetails.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Unit Price: ₹{item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {/* Items breakdown */}
              <div className="space-y-2 pb-3 border-b">
                {orderDetails.orderItems.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {orderDetails.shipping > 0 ? `₹${orderDetails.shipping.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                {orderDetails.totalAmount !== orderDetails.subtotal + orderDetails.shipping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -₹{(orderDetails.subtotal + orderDetails.shipping - orderDetails.totalAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">₹{orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {orderDetails.address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2" />
                Delivery Address
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {orderDetails.customer?.firstName} {orderDetails.customer?.lastName}
                </p>
                <p>{orderDetails.address.street}</p>
                <p>{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.postalCode}</p>
                {orderDetails.address.country && <p>{orderDetails.address.country}</p>}
                {orderDetails.customer?.phone && (
                  <p className="flex items-center mt-2">
                    <FiPhone className="mr-1" size={14} />
                    {orderDetails.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
