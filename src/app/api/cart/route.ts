import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/cart - Get user's cart
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

    console.log('🛒 Website API: Fetching cart for user:', userId);

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Fetching cart locally');

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

        // Find cart for this user
        console.log('🔍 Looking for cart with userId:', userId);
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                  }
                }
              }
            }
          }
        });

        console.log('📋 Cart found:', cart ? `Cart with ${cart.items.length} items` : 'No cart found');
        await prisma.$disconnect();

        if (!cart) {
          console.log('❌ Cart not found for user:', userId);
          return NextResponse.json({ items: [] });
        }

        console.log(`✅ Found cart with ${cart.items.length} items locally`);
        return NextResponse.json(cart);

      } catch (localError) {
        console.error('❌ Local cart fetch failed:', localError);
        console.log('🔄 Falling back to admin panel API due to local error');

        // Ensure Prisma is disconnected even on error
        try {
          await prisma.$disconnect();
        } catch (disconnectError) {
          console.error('❌ Error disconnecting Prisma:', disconnectError);
        }
      }
    }

    // Forward to admin panel API (production or fallback)
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to fetch cart' },
        { status: response.status }
      );
    }

    const cart = await response.json();
    console.log(`🛒 Cart fetched from admin API`);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to add item to cart' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to update cart' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel

    let url = `${API_BASE_URL}/cart?userId=${userId}`;
    if (productId) {
      url += `&productId=${productId}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to remove from cart' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
