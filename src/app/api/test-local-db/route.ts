import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/test-local-db - Test local database connection
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing local database connection...');
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        error: 'DATABASE_URL not configured',
        env: process.env.NODE_ENV,
      }, { status: 500 });
    }

    // Import Prisma client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    try {
      // Test connection
      await prisma.$connect();
      console.log('✅ Database connected');

      // Test queries
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const orderCount = await prisma.order.count();

      console.log('✅ Queries successful');

      // Check demo customer
      const demoUser = await prisma.user.findUnique({
        where: { email: 'customer@example.com' },
        include: { customer: true }
      });

      await prisma.$disconnect();

      return NextResponse.json({
        status: 'success',
        database: 'connected',
        counts: {
          users: userCount,
          products: productCount,
          orders: orderCount,
        },
        demoUser: demoUser ? {
          exists: true,
          id: demoUser.id,
          email: demoUser.email,
          hasCustomerProfile: !!demoUser.customer,
        } : {
          exists: false,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (dbError) {
      await prisma.$disconnect();
      throw dbError;
    }

  } catch (error) {
    console.error('❌ Local database test failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
    }, { status: 500 });
  }
}

// POST /api/test-local-db - Create demo customer locally
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Creating demo customer locally...');

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        error: 'DATABASE_URL not configured',
      }, { status: 500 });
    }

    // Import Prisma client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    try {
      // Check if demo customer exists
      let user = await prisma.user.findUnique({
        where: { email: 'customer@example.com' },
        include: { customer: true }
      });

      if (!user) {
        console.log('Creating demo customer...');
        user = await prisma.user.create({
          data: {
            name: 'Demo Customer',
            email: 'customer@example.com',
            password: 'customer123',
            role: 'CUSTOMER',
            customer: {
              create: {
                firstName: 'Demo',
                lastName: 'Customer',
                phone: '+91 9876543210',
                isSubscribed: false,
                loyaltyPoints: 100,
              }
            }
          },
          include: { customer: true }
        });
        console.log('✅ Demo customer created');
      } else {
        console.log('✅ Demo customer already exists');
      }

      // Ensure we have a product
      let product = await prisma.product.findFirst({
        where: { isActive: true }
      });

      if (!product) {
        console.log('Creating demo product...');
        product = await prisma.product.create({
          data: {
            name: 'Demo Chocolate Cake',
            description: 'A delicious chocolate cake for testing',
            price: 299.99,
            costPrice: 150.00,
            sku: 'DEMO-CHOC-001',
            unit: 'piece',
            isActive: true,
          }
        });
        console.log('✅ Demo product created');
      }

      await prisma.$disconnect();

      return NextResponse.json({
        status: 'success',
        message: 'Demo customer setup completed',
        user: {
          id: user.id,
          email: user.email,
          customerId: user.customer?.id,
        },
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      });

    } catch (dbError) {
      await prisma.$disconnect();
      throw dbError;
    }

  } catch (error) {
    console.error('❌ Demo customer creation failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
