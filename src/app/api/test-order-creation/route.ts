import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    console.log('🧪 Testing order creation with minimal data');
    
    // Create a minimal test order
    const testOrderData = {
      userId: 'cme5x4no70006l304lcp0jib2', // Your real user ID
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          unitPrice: 100,
          price: 100,
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

    const response = await fetch(`${API_BASE_URL}/customer-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      testData: testOrderData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error testing order creation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
