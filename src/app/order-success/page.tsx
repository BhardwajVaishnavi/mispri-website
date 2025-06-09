'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiDownload, FiShare2, FiTruck, FiMail } from 'react-icons/fi';
import OrderTracking from '@/components/OrderTracking';

function OrderSuccessContent() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get('orderNumber') || searchParams.get('order') || 'ORD-' + Date.now();

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Mock order details - in production, fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockOrder = {
          id: orderNumber,
          orderNumber: orderNumber,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          totalAmount: 1299,
          createdAt: new Date().toISOString(),
          estimatedDelivery: 'Tomorrow, December 25, 2024',
          items: [
            {
              id: '1',
              name: 'Chocolate Birthday Cake',
              quantity: 1,
              price: 599,
              image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
            },
            {
              id: '2',
              name: 'Red Rose Bouquet',
              quantity: 1,
              price: 899,
              image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=300&fit=crop'
            }
          ],
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main Street',
            city: 'Bhubaneswar',
            state: 'Odisha',
            pincode: '751001',
            phone: '+91 98765 43210'
          }
        };

        setOrderDetails(mockOrder);

        // Simulate email sending
        setTimeout(() => {
          setEmailSent(true);
        }, 2000);

      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  const handleDownloadInvoice = () => {
    if (!orderDetails) {
      alert('Order details not loaded yet. Please wait and try again.');
      return;
    }

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
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
          .company-tagline { font-size: 14px; color: #666; }
          .invoice-details { display: flex; justify-content: space-between; margin: 30px 0; }
          .invoice-info, .customer-info { flex: 1; }
          .invoice-info { margin-right: 20px; }
          .section-title { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; color: #2563eb; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .thank-you { font-size: 18px; color: #2563eb; font-weight: bold; margin-bottom: 10px; }
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
            <p><strong>Payment Status:</strong> Paid</p>
            <p><strong>Order Status:</strong> Confirmed</p>
          </div>
          <div class="customer-info">
            <div class="section-title">Delivery Address</div>
            ${orderDetails.shippingAddress ? `
              <p><strong>${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}</strong></p>
              <p>${orderDetails.shippingAddress.street}</p>
              <p>${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.pincode}</p>
              <p>Phone: ${orderDetails.shippingAddress.phone}</p>
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
            ${orderDetails.items ? orderDetails.items.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">No items found</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
              <td><strong>₹${orderDetails.totalAmount ? (orderDetails.totalAmount - 100).toFixed(2) : '0.00'}</strong></td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
              <td><strong>Free</strong></td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
              <td><strong>₹${orderDetails.totalAmount ? orderDetails.totalAmount.toFixed(2) : '0.00'}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="footer">
          <div class="thank-you">Thank you for your business!</div>
          <p>This is a computer-generated invoice for Order #${orderNumber}</p>
          <p>For any queries, contact us at support@mispri.com or call +91-XXXXXXXXXX</p>
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

  const handleShareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order #${orderNumber}`,
          text: `I just placed an order for some amazing products!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 inline-block">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-green-600">#{orderNumber}</p>
          </div>
        </div>

        {/* Email Confirmation Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
              emailSent ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <FiMail className={`w-5 h-5 ${emailSent ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {emailSent ? 'Confirmation Email Sent!' : 'Sending Confirmation Email...'}
              </h3>
              <p className="text-sm text-gray-600">
                {emailSent
                  ? 'We\'ve sent order details to your email address.'
                  : 'Please wait while we send your order confirmation.'
                }
              </p>
            </div>
            {!emailSent && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleDownloadInvoice}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
          >
            <FiDownload className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Download Invoice</span>
          </button>

          <button
            onClick={handleShareOrder}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
          >
            <FiShare2 className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Share Order</span>
          </button>

          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
          >
            <FiTruck className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Track Order</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Tracking */}
          <div>
            <OrderTracking orderNumber={orderNumber} />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {orderDetails?.items && (
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{orderDetails?.totalAmount ? (orderDetails.totalAmount - 100).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-primary-600">₹{orderDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {orderDetails?.shippingAddress && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                  <p>{orderDetails.shippingAddress.street}</p>
                  <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pincode}</p>
                  <p>{orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
