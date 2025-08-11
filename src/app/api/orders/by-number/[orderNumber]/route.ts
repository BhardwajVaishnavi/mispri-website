import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/orders/by-number/[orderNumber] - Get order by order number
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching order by number:', orderNumber);

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Fetching order locally');
      
      try {
        // Import Prisma client for local processing
        const { PrismaClient } = require('@prisma/client');

        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL
            }
          }
        });

        console.log('🔍 Searching for order:', orderNumber);

        // Find order by order number with correct relationships
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { orderNumber: orderNumber },
              { id: orderNumber }
            ]
          },
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
          }
        });

        // If order found and has addressId, fetch the address separately (admin panel schema)
        let orderWithAddress = order;
        if (order && order.addressId) {
          const address = await prisma.address.findUnique({
            where: { id: order.addressId },
            select: {
              street: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
              firstName: true,
              lastName: true,
              phone: true,
            }
          });

          orderWithAddress = {
            ...order,
            address: address
          };
        }

        await prisma.$disconnect();

        if (!order) {
          console.log('❌ Order not found locally:', orderNumber);

          // Check if any orders exist at all
          const prismaCheck = new PrismaClient({
            datasources: {
              db: {
                url: process.env.DATABASE_URL
              }
            }
          });

          const orderCount = await prismaCheck.order.count();
          console.log(`📊 Total orders in database: ${orderCount}`);

          if (orderCount > 0) {
            const recentOrders = await prismaCheck.order.findMany({
              select: { id: true, orderNumber: true },
              orderBy: { createdAt: 'desc' },
              take: 5
            });
            console.log('📋 Recent orders:', recentOrders);
          }

          await prismaCheck.$disconnect();

          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }

        console.log('✅ Order found locally:', orderWithAddress.orderNumber || orderWithAddress.id);
        return NextResponse.json(orderWithAddress);

      } catch (localError) {
        console.error('❌ Local order fetch failed:', localError);

        // Ensure prisma connection is closed
        try {
          await prisma.$disconnect();
        } catch (disconnectError) {
          console.error('❌ Error disconnecting prisma:', disconnectError);
        }

        // Fall back to API forwarding instead of returning error
        console.log('🔄 Falling back to admin panel API due to local error');
      }
    }

    // Forward to admin panel API (production or fallback)
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/orders/by-number/${orderNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to fetch order' },
        { status: response.status }
      );
    }

    const order = await response.json();
    console.log('✅ Order fetched from admin API');
    return NextResponse.json(order);

  } catch (error) {
    console.error('❌ Error fetching order by number:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
