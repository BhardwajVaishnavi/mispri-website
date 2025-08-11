import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/debug-database - Debug database contents
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging database contents...');

    // Import Prisma client
    const { PrismaClient } = require('@prisma/client');
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      database_url: process.env.DATABASE_URL ? 'Set' : 'Not set',
      counts: {},
      sample_data: {}
    };

    try {
      // Count all tables
      debugInfo.counts.customers = await prisma.customer.count();
      debugInfo.counts.orders = await prisma.order.count();
      debugInfo.counts.orderItems = await prisma.orderItem.count();
      debugInfo.counts.addresses = await prisma.address.count();
      debugInfo.counts.products = await prisma.product.count();

      console.log('📊 Database counts:', debugInfo.counts);

      // Get sample customers
      if (debugInfo.counts.customers > 0) {
        debugInfo.sample_data.customers = await prisma.customer.findMany({
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          take: 3
        });
      }

      // Get sample orders with details
      if (debugInfo.counts.orders > 0) {
        debugInfo.sample_data.orders = await prisma.order.findMany({
          select: {
            id: true,
            orderNumber: true,
            customerId: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        });
      }

      // Get sample addresses
      if (debugInfo.counts.addresses > 0) {
        debugInfo.sample_data.addresses = await prisma.address.findMany({
          select: {
            id: true,
            customerId: true,
            city: true,
            state: true,
          },
          take: 3
        });
      }

      // Check specific order
      const specificOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: 'ORD-1753966092851-166' },
            { id: 'ORD-1753966092851-166' }
          ]
        },
        select: {
          id: true,
          orderNumber: true,
          customerId: true,
          status: true,
        }
      });

      debugInfo.specific_order_check = specificOrder || 'Not found';

      // Check specific user
      const specificUser = await prisma.customer.findFirst({
        where: { userId: 'cmdrci7vu0004l80460dbl0tu' },
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
        }
      });

      debugInfo.specific_user_check = specificUser || 'Not found';

      // If user exists, get their orders
      if (specificUser) {
        const userOrders = await prisma.order.findMany({
          where: { customerId: specificUser.id },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
          }
        });
        debugInfo.specific_user_orders = userOrders;
      }

    } catch (queryError) {
      console.error('❌ Database query error:', queryError);
      debugInfo.error = {
        message: queryError instanceof Error ? queryError.message : 'Unknown error',
        type: 'Database query failed'
      };
    }

    await prisma.$disconnect();

    console.log('✅ Debug info collected:', debugInfo);
    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('❌ Debug database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug database',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
