import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// POST /api/send-order-email - Send order details via email
export async function POST(request: NextRequest) {
  try {
    const { orderNumber, customerEmail, customerName, orderDetails } = await request.json();

    if (!orderNumber || !customerEmail || !orderDetails) {
      return NextResponse.json(
        { error: 'Order number, customer email, and order details are required' },
        { status: 400 }
      );
    }

    console.log('📧 Sending order email to:', customerEmail);

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.log('🔄 Development mode: Simulating email send');
      
      try {
        // Import nodemailer for local email sending
        const nodemailer = require('nodemailer');

        // Create transporter (you can configure this with your email settings)
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Generate email HTML
        const emailHTML = generateOrderEmailHTML(orderDetails, customerName);

        // Email options
        const mailOptions = {
          from: process.env.SMTP_FROM || 'noreply@mispri.com',
          to: customerEmail,
          subject: `Order Confirmation - #${orderNumber}`,
          html: emailHTML,
        };

        // Send email if SMTP is configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          await transporter.sendMail(mailOptions);
          console.log('✅ Email sent successfully via SMTP');
        } else {
          console.log('⚠️ SMTP not configured, simulating email send');
          // Simulate email sending delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return NextResponse.json({
          success: true,
          message: 'Order details sent successfully',
          recipient: customerEmail,
        });

      } catch (localError) {
        console.error('❌ Local email send failed:', localError);
        
        // Simulate successful email for development
        console.log('📧 Simulating successful email send for development');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return NextResponse.json({
          success: true,
          message: 'Order details sent successfully (simulated)',
          recipient: customerEmail,
          note: 'Email sending simulated in development mode',
        });
      }
    }

    // Forward to admin panel API (production)
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber,
        customerEmail,
        customerName,
        orderDetails,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to send email' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Email sent via admin API');
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Generate HTML email template
function generateOrderEmailHTML(orderDetails: any, customerName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - #${orderDetails.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #5F9EA0; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .order-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .order-items { margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .total { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .total-final { font-weight: bold; font-size: 18px; color: #5F9EA0; border-top: 2px solid #5F9EA0; padding-top: 10px; margin-top: 10px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
        .status-delivered { background-color: #d4edda; color: #155724; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MISPRI</h1>
          <p>Order Confirmation</p>
        </div>
        
        <div class="content">
          <h2>Hello ${customerName}!</h2>
          <p>Thank you for your order. Here are your order details:</p>
          
          <div class="order-info">
            <h3>Order Information</h3>
            <p><strong>Order Number:</strong> #${orderDetails.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${orderDetails.status.toLowerCase()}">${orderDetails.status.replace('_', ' ')}</span></p>
            <p><strong>Payment Status:</strong> <span class="status-badge status-${orderDetails.paymentStatus.toLowerCase()}">${orderDetails.paymentStatus}</span></p>
          </div>
          
          <div class="order-items">
            <h3>Order Items</h3>
            ${orderDetails.orderItems.map((item: any) => `
              <div class="item">
                <div>
                  <strong>${item.product.name}</strong><br>
                  <small>Quantity: ${item.quantity} × ₹${item.unitPrice.toFixed(2)}</small>
                </div>
                <div>₹${(item.unitPrice * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <h3>Order Summary</h3>
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${orderDetails.shipping > 0 ? `₹${orderDetails.shipping.toFixed(2)}` : 'Free'}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>₹${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          ${orderDetails.address ? `
            <div class="order-info">
              <h3>Delivery Address</h3>
              <p>
                ${orderDetails.customer?.firstName} ${orderDetails.customer?.lastName}<br>
                ${orderDetails.address.street}<br>
                ${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.postalCode}<br>
                ${orderDetails.address.country || 'India'}
                ${orderDetails.customer?.phone ? `<br>Phone: ${orderDetails.customer.phone}` : ''}
              </p>
            </div>
          ` : ''}
          
          <p>We'll send you updates about your order status. If you have any questions, please contact us.</p>
          
          <p>Thank you for choosing MISPRI!</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this email.</p>
          <p>© 2024 MISPRI - Bakery & Flower Shop, Bhubaneswar, Odisha</p>
          <p>For support, contact us at support@mispri.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
