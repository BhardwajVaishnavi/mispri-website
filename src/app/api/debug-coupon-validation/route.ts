import { NextRequest, NextResponse } from 'next/server';

// POST /api/debug-coupon-validation - Debug coupon validation issues
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, customerId, orderAmount } = body;

    console.log('🔍 Debug Coupon Validation Request:', {
      couponCode,
      customerId,
      orderAmount,
      customerIdType: typeof customerId,
    });

    // Forward to admin panel for debugging
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const debugResponse = await fetch(`${API_BASE_URL}/debug-coupon-validation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couponCode,
        customerId,
        orderAmount,
      }),
    });

    const debugResult = await debugResponse.json();

    return NextResponse.json({
      websiteDebug: {
        receivedCustomerId: customerId,
        receivedCouponCode: couponCode,
        receivedOrderAmount: orderAmount,
        customerIdType: typeof customerId,
      },
      adminPanelDebug: debugResult,
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  }
}
