import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/customer-orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🌐 Website API: Fetching orders for user:', userId);

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Fetching orders locally');

      let prisma;
      try {
        // Import Prisma client for local processing
        const { PrismaClient } = require('@prisma/client');

        console.log('🔄 Initializing Prisma client...');
        prisma = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL
            }
          }
        });

        console.log('✅ Prisma client initialized');
        console.log('🔍 Looking for customer with userId:', userId);

        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Database uses admin panel schema - find customer by userId
        const customer = await prisma.customer.findFirst({
          where: { userId: userId },
        });

        if (!customer) {
          await prisma.$disconnect();
          console.log('❌ Customer not found for userId:', userId);
          return NextResponse.json([]);
        }

        console.log('✅ Customer found:', customer.id);

        // Fetch orders for this customer (admin panel schema)
        console.log('🔍 Fetching orders for customer:', customer.id);
        const orders = await prisma.order.findMany({
          where: { customerId: customer.id },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                  }
                }
              }
            },
            customer: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Fetch addresses for orders that have addressId (admin panel schema)
        const ordersWithAddresses = await Promise.all(
          orders.map(async (order) => {
            if (order.addressId) {
              const address = await prisma.address.findUnique({
                where: { id: order.addressId },
                select: {
                  city: true,
                  state: true,
                  street: true,
                  postalCode: true,
                  country: true,
                }
              });
              return { ...order, address };
            }
            return order;
          })
        );

        await prisma.$disconnect();

        console.log(`✅ Found ${ordersWithAddresses.length} orders locally for user:`, userId);
        return NextResponse.json(ordersWithAddresses);

      } catch (localError) {
        console.error('❌ Local order fetch failed:', localError);
        console.error('Error details:', {
          message: localError instanceof Error ? localError.message : 'Unknown error',
          stack: localError instanceof Error ? localError.stack : undefined,
          userId: userId
        });

        // Ensure prisma connection is closed if it was created
        if (prisma) {
          try {
            await prisma.$disconnect();
            console.log('✅ Prisma disconnected after error');
          } catch (disconnectError) {
            console.error('❌ Error disconnecting prisma:', disconnectError);
          }
        }

        // Fall back to API forwarding
        console.log('🔄 Falling back to admin panel API due to local error');
      }
    }

    // Forward the request to the admin panel API (production or fallback)
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/customer-orders?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to fetch orders' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    console.log(`📋 Found ${orders.length} orders for user:`, userId);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Website API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/customer-orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    console.log('🌐 Website API: Creating order:', orderData);

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    console.log('🔍 Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- isDevelopment:', isDevelopment);
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- API_BASE_URL:', API_BASE_URL);

    // Force local processing to avoid API forwarding issues
    if (true || (isDevelopment && process.env.DATABASE_URL)) {
      console.log('🔄 Development mode: Processing order locally');

      // Import Prisma client for local processing
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      });

      try {
        const { userId, items, shippingAddress, paymentMethod, totalAmount, subtotal, shipping, discountAmount, couponCode, couponId } = orderData;

        // BULLETPROOF customer finding/creation
        console.log('🔍 Website API: Finding customer for userId:', userId);
        let customer;
        let user;

        // First, try to find user by email (most reliable)
        if (shippingAddress?.email) {
          user = await prisma.user.findUnique({
            where: { email: shippingAddress.email },
            include: { customer: true }
          });

          if (user) {
            console.log('✅ Website API: Found user by email:', user.email);
            if (user.customer) {
              console.log('✅ Website API: User has customer profile:', user.customer.id);
              customer = user.customer;
            }
          } else {
            // Create new user
            console.log('🔄 Website API: Creating new user with email:', shippingAddress.email);
            const customerName = `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer';

            user = await prisma.user.create({
              data: {
                name: customerName,
                email: shippingAddress.email,
                password: 'temp-password',
                role: 'CUSTOMER',
              },
            });
            console.log('✅ Website API: Created new user:', user.email);
          }
        } else {
          // Fallback to userId lookup
          user = await prisma.user.findUnique({
            where: { id: userId },
            include: { customer: true }
          });

          if (user?.customer) {
            customer = user.customer;
            console.log('✅ Website API: Found customer by userId:', customer.id);
          }
        }

        // If no customer yet, create one using UPSERT (100% safe)
        if (!customer && user) {
          console.log('🔄 Website API: Creating customer with UPSERT...');

          customer = await prisma.customer.upsert({
            where: { userId: user.id },
            update: {
              firstName: shippingAddress?.firstName || user.name.split(' ')[0] || '',
              lastName: shippingAddress?.lastName || user.name.split(' ').slice(1).join(' ') || '',
              phone: shippingAddress?.phone || null,
            },
            create: {
              userId: user.id,
              firstName: shippingAddress?.firstName || user.name.split(' ')[0] || '',
              lastName: shippingAddress?.lastName || user.name.split(' ').slice(1).join(' ') || '',
              phone: shippingAddress?.phone || null,
            },
          });
          console.log('✅ Website API: Customer UPSERTED successfully:', customer.id);
        }

        if (!customer) {
          throw new Error('Failed to find or create customer');
        }

        // Create address if provided
        let addressId = null;
        if (shippingAddress) {
          const address = await prisma.address.create({
            data: {
              customerId: customer.id,
              street: shippingAddress.street || '',
              city: shippingAddress.city || '',
              state: shippingAddress.state || '',
              postalCode: shippingAddress.pincode || shippingAddress.postalCode || '',
              country: shippingAddress.country || 'India',
              isDefault: false,
            },
          });
          addressId = address.id;
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // Handle coupon usage if provided
        let couponUsageId = null;
        if (couponId && couponCode && discountAmount > 0) {
          console.log('🎯 Processing coupon usage:', { couponId, couponCode, discountAmount });

          try {
            // Find the customer coupon assignment
            const customerCoupon = await prisma.customerCoupon.findFirst({
              where: {
                customerId: customer.id,
                couponId: couponId,
              },
            });

            if (customerCoupon) {
              // Update usage count
              await prisma.customerCoupon.update({
                where: { id: customerCoupon.id },
                data: {
                  usageCount: customerCoupon.usageCount + 1,
                },
              });

              console.log('✅ Coupon usage updated for customer');
            } else {
              console.warn('⚠️ Customer coupon assignment not found, but proceeding with order');
            }
          } catch (couponError) {
            console.error('❌ Error processing coupon usage:', couponError);
            // Don't fail the order if coupon processing fails
          }
        }

        // Create order
        const order = await prisma.order.create({
          data: {
            customerId: customer.id,
            addressId,
            orderNumber,
            totalAmount: totalAmount || 0,
            subtotal: subtotal || 0,
            shipping: shipping || 0,
            couponDiscount: discountAmount || 0,
            couponCode: couponCode || null,
            status: 'PENDING_ASSIGNMENT',
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: 'PENDING',
            orderType: 'ONLINE',
          },
        });

        // Create OrderCoupon record if coupon was used
        if (couponId && discountAmount > 0) {
          try {
            await prisma.orderCoupon.create({
              data: {
                orderId: order.id,
                couponId: couponId,
                discountAmount: discountAmount,
              },
            });
            console.log('✅ OrderCoupon record created');
          } catch (orderCouponError) {
            console.error('❌ Error creating OrderCoupon record:', orderCouponError);
            // Don't fail the order if OrderCoupon creation fails
          }
        }

        // Create order items
        const orderItems = await Promise.all(
          items.map((item: any) =>
            prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId || item.id,
                variantId: item.variantId || null,
                quantity: item.quantity,
                unitPrice: item.price || item.unitPrice || 0,
                weight: item.weight || null,
                customName: item.customName || null,
              },
            })
          )
        );

        // Return complete order
        const completeOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            address: true,
            customer: {
              include: {
                user: true,
              },
            },
          },
        });

        await prisma.$disconnect();

        console.log('✅ Order created locally:', order.orderNumber);

        // Send order confirmation email for local processing
        try {
          console.log('📧 Website API: Preparing order confirmation email...');

          // Use nodemailer directly since we can't import from admin panel
          const nodemailer = require('nodemailer');

          if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransporter({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: parseInt(process.env.SMTP_PORT || '587'),
              secure: process.env.SMTP_SECURE === 'true',
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
              tls: {
                rejectUnauthorized: false
              }
            });

            const emailHTML = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #5F9EA0 0%, #4a8a8d 100%); color: white; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px;">🎉 Order Confirmed!</h1>
                  <p style="margin: 10px 0 0 0;">Thank you for your purchase!</p>
                </div>
                <div style="padding: 30px; background: white;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 24px; font-weight: 600; color: #5F9EA0;">#${order.orderNumber}</div>
                    <div style="background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0;">✅ Order Confirmed</div>
                  </div>
                  <h3>Customer Information:</h3>
                  <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}<br>
                  <strong>Email:</strong> ${user.email}</p>

                  <h3>Order Details:</h3>
                  <p><strong>Total Amount:</strong> ₹${totalAmount}<br>
                  <strong>Payment Method:</strong> ${paymentMethod}<br>
                  <strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>

                  <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h4>What's Next?</h4>
                    <p>✅ Order Received - We've received your order<br>
                    📞 Confirmation Call - Our team will call you soon<br>
                    🎂 Preparation - We'll start preparing your items<br>
                    🚚 Delivery - Your order will be delivered</p>
                  </div>
                </div>
                <div style="background: #333; color: white; padding: 20px; text-align: center;">
                  <h3>🌸 Mispri</h3>
                  <p>Bakery & Flower Shop<br>Bhubaneswar, Odisha, India</p>
                </div>
              </div>
            `;

            const mailOptions = {
              from: `"${process.env.EMAIL_FROM_NAME || 'Mispri'}" <${process.env.SMTP_USER}>`,
              to: user.email,
              subject: `🎉 Order Confirmation - #${order.orderNumber}`,
              html: emailHTML,
            };

            // Send email asynchronously
            transporter.sendMail(mailOptions).then(() => {
              console.log('✅ Website API: Order confirmation email sent successfully');
            }).catch(error => {
              console.error('❌ Website API: Failed to send email:', error);
            });
          } else {
            console.log('⚠️ Website API: SMTP not configured, skipping email');
          }
        } catch (emailError) {
          console.error('❌ Website API: Error preparing email:', emailError);
        }

        return NextResponse.json(completeOrder);

      } catch (localError) {
        await prisma.$disconnect();
        console.error('❌ Local order creation failed:', localError);
        console.error('❌ Local error details:', localError.message);
        console.error('❌ Local error stack:', localError.stack);
        // Fall back to API forwarding
      }
    }

    // Forward the request to the admin panel API (production or fallback)
    const targetUrl = `${API_BASE_URL}/customer-orders`;
    console.log('🔄 Forwarding to admin panel API:', targetUrl);
    console.log('📦 Forwarding order data:', JSON.stringify(orderData, null, 2));

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📡 Admin panel API response status:', response.status);

    if (!response.ok) {
      console.error('❌ Admin panel API error:', response.status, response.statusText);
      let error;
      try {
        error = await response.json();
        console.error('❌ Admin panel API error details:', error);
      } catch (parseError) {
        const errorText = await response.text();
        console.error('❌ Admin panel API error text:', errorText);
        error = { error: errorText || 'Failed to create order' };
      }
      return NextResponse.json(
        { error: error.error || 'Failed to create order' },
        { status: response.status }
      );
    }

    const order = await response.json();
    console.log('✅ Website API: Order created successfully:', order.orderNumber);

    return NextResponse.json(order);
  } catch (error) {
    console.error('❌ Website API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
