import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// POST /api/create-test-order - Create a test order for debugging
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Creating test order for user:', userId);

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
      // Find or create customer (admin panel schema)
      let customer = await prisma.customer.findFirst({
        where: { userId: userId }
      });

      if (!customer) {
        // Create a test customer using UPSERT
        customer = await prisma.customer.upsert({
          where: { userId: userId },
          update: {
            firstName: 'Test',
            lastName: 'Customer',
            phone: '+91 9876543210',
          },
          create: {
            userId: userId,
            firstName: 'Test',
            lastName: 'Customer',
            phone: '+91 9876543210',
          }
        });
        console.log('✅ Created test customer:', customer.id);
      }

      // Create a test address (admin panel schema)
      const address = await prisma.address.create({
        data: {
          customerId: customer.id,
          firstName: 'Test',
          lastName: 'Customer',
          phone: '+91 9876543210',
          street: '123 Test Street, Test Area',
          city: 'Bhubaneswar',
          state: 'Odisha',
          postalCode: '751001',
          country: 'India',
          type: 'BOTH',
          isDefault: true,
        }
      });

      // Find or create a test product (admin panel schema)
      let product = await prisma.product.findFirst({
        where: { name: { contains: 'Test' } }
      });

      if (!product) {
        // Find or create a test category first
        let category = await prisma.category.findFirst();
        if (!category) {
          category = await prisma.category.create({
            data: {
              name: 'Test Category',
              description: 'Test category for debugging',
              isActive: true,
            }
          });
          console.log('✅ Created test category:', category.id);
        }

        // Create a test product
        product = await prisma.product.create({
          data: {
            name: 'Test Chocolate Cake',
            description: 'Delicious test chocolate cake for debugging',
            price: 599.00,
            imageUrl: '/placeholder-product.svg',
            categoryId: category.id,
            isActive: true,
            stock: 100,
          }
        });
        console.log('✅ Created test product:', product.id);
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create test order (admin panel schema)
      const order = await prisma.order.create({
        data: {
          customerId: customer.id,
          addressId: address.id,
          orderNumber: orderNumber,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'ONLINE',
          totalAmount: 649.00,
          subtotal: 599.00,
          shipping: 50.00,
          discount: 0,
          orderType: 'ONLINE',
          notes: 'Test order created for debugging',
        }
      });

      // Create order items (admin panel schema)
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: 1,
          unitPrice: 599.00,
          weight: '1 Kg',
        }
      });

      // Fetch the complete order with all relations
      const completeOrder = await prisma.order.findUnique({
        where: { id: order.id },
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

      // Fetch address separately (admin panel schema)
      const orderAddress = await prisma.address.findUnique({
        where: { id: address.id },
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

      const result = {
        ...completeOrder,
        address: orderAddress
      };

      await prisma.$disconnect();

      console.log('✅ Test order created successfully:', orderNumber);
      return NextResponse.json({
        success: true,
        message: 'Test order created successfully',
        order: result,
        orderNumber: orderNumber,
        customerId: customer.id,
        addressId: address.id,
      });

    } catch (dbError) {
      await prisma.$disconnect();
      console.error('❌ Database error creating test order:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error creating test order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
