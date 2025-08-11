import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing order creation API...');
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const targetUrl = `${API_BASE_URL}/customer-orders`;
    
    // Create a simple test order
    const testOrderData = {
      userId: 'test-user-id',
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          unitPrice: 100,
          variantId: null,
          weight: null,
          customName: 'Test Cake Name',
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        street: '123 Test Street',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751001',
        country: 'India',
      },
      paymentMethod: 'COD',
      totalAmount: 100,
      subtotal: 100,
      shipping: 0,
    };
    
    console.log('🎯 Test target URL:', targetUrl);
    console.log('📦 Test order data:', JSON.stringify(testOrderData, null, 2));
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });
    
    console.log('📡 Test response status:', response.status);
    console.log('📡 Test response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test order creation successful:', result);
      return NextResponse.json({
        success: true,
        message: 'Test order created successfully',
        order: result,
      });
    } else {
      const errorText = await response.text();
      console.error('❌ Test order creation failed:', response.status, errorText);
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${errorText}`,
        status: response.status,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Test order creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test order endpoint - use POST to test order creation',
    usage: 'POST /api/test-order',
  });
}
