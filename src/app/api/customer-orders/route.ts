import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

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

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      console.log('📋 No customer found for user:', userId);
      return NextResponse.json([]);
    }

    // Get orders for this customer
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Found ${orders.length} orders for customer:`, customer.firstName);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Website API: Error fetching customer orders:', error);
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
    const { userId, items, shippingAddress, paymentMethod, totalAmount, subtotal, shipping, ...otherData } = orderData;

    console.log('🌐 Website API: Creating order for user:', userId);

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'User ID and items are required' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      customer = await prisma.customer.create({
        data: {
          userId,
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
        },
      });
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

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        addressId,
        orderNumber,
        totalAmount: totalAmount || 0,
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: 'PENDING',
        orderType: 'ONLINE', // All website orders are online orders
        ...otherData,
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map((item: any) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId || item.id,
            quantity: item.quantity,
            unitPrice: item.price || item.unitPrice || 0,
          },
        })
      )
    );

    // Clear user's cart after successful order
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // Return order with items
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

    console.log('✅ Website API: Order created successfully:', completeOrder?.orderNumber);
    return NextResponse.json(completeOrder);
  } catch (error) {
    console.error('❌ Website API Error:', error);
    return NextResponse.json(
      { error: `Failed to create order: ${error.message}` },
      { status: 500 }
    );
  }
}
