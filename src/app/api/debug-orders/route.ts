import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/debug-orders - Debug orders in database
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking orders in database...');

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Checking local database');
      
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

        // Get all orders
        const orders = await prisma.order.findMany({
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            },
            customer: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Limit to last 10 orders
        });

        // Get order count
        const orderCount = await prisma.order.count();

        // Get customer count
        const customerCount = await prisma.customer.count();

        // Get user count
        const userCount = await prisma.user.count();

        await prisma.$disconnect();

        console.log(`✅ Found ${orders.length} orders in database`);
        
        return NextResponse.json({
          success: true,
          counts: {
            orders: orderCount,
            customers: customerCount,
            users: userCount,
          },
          recentOrders: orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Unknown',
            itemCount: order.orderItems?.length || 0,
          })),
          environment: 'development-local'
        });

      } catch (localError) {
        console.error('❌ Local database check failed:', localError);
        return NextResponse.json({
          success: false,
          error: localError instanceof Error ? localError.message : 'Database error',
          environment: 'development-local'
        }, { status: 500 });
      }
    }

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/debug-orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Admin API not available',
        environment: 'production-forwarded'
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      environment: 'production-forwarded'
    });

  } catch (error) {
    console.error('❌ Debug orders error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
