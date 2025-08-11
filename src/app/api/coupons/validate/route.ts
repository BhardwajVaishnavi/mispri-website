import { NextRequest, NextResponse } from 'next/server';

// POST /api/coupons/validate - Validate coupon for customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      couponCode,
      customerId,
      orderAmount,
    } = body;

    // Validation
    if (!couponCode || !customerId || !orderAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: couponCode, customerId, orderAmount' },
        { status: 400 }
      );
    }

    if (orderAmount <= 0) {
      return NextResponse.json(
        { error: 'Order amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Forward request to admin panel API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3003/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel
    
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couponCode,
        customerId,
        orderAmount: parseFloat(orderAmount),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to validate coupon' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
