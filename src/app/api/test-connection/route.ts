import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/test-connection - Test connection to admin panel API
export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    console.log('🔍 Testing connection to admin panel API:', API_BASE_URL);

    // Test 1: Basic connection test
    const testResponse = await fetch(`${API_BASE_URL}/debug`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Debug API response status:', testResponse.status);

    let debugData = null;
    if (testResponse.ok) {
      debugData = await testResponse.json();
      console.log('✅ Debug API response:', debugData);
    } else {
      const errorText = await testResponse.text();
      console.error('❌ Debug API error:', errorText);
    }

    // Test 2: Customer login test
    const loginResponse = await fetch(`${API_BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@example.com',
        password: 'customer123'
      }),
    });

    console.log('📡 Login API response status:', loginResponse.status);

    let loginData = null;
    if (loginResponse.ok) {
      loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.email);
    } else {
      const errorText = await loginResponse.text();
      console.error('❌ Login failed:', errorText);
    }

    // Test 3: Products test
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=3`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Products API response status:', productsResponse.status);

    let productsData = null;
    if (productsResponse.ok) {
      productsData = await productsResponse.json();
      console.log('✅ Products fetched:', productsData.length);
    } else {
      const errorText = await productsResponse.text();
      console.error('❌ Products fetch failed:', errorText);
    }

    return NextResponse.json({
      status: 'success',
      apiBaseUrl: API_BASE_URL,
      tests: {
        debug: {
          status: testResponse.status,
          success: testResponse.ok,
          data: debugData,
        },
        login: {
          status: loginResponse.status,
          success: loginResponse.ok,
          data: loginData ? { id: loginData.id, email: loginData.email } : null,
        },
        products: {
          status: productsResponse.status,
          success: productsResponse.ok,
          count: productsData ? productsData.length : 0,
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api',
    }, { status: 500 });
  }
}

// POST /api/test-connection - Test order creation through forwarding
export async function POST(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    console.log('🔍 Testing order creation through API forwarding...');

    // Step 1: Login to get user data
    const loginResponse = await fetch(`${API_BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@example.com',
        password: 'customer123'
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      throw new Error(`Login failed: ${error}`);
    }

    const user = await loginResponse.json();
    console.log('✅ User logged in:', user.email);

    // Step 2: Get products
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=1`);
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await productsResponse.json();
    if (products.length === 0) {
      throw new Error('No products available');
    }

    const testProduct = products[0];
    console.log('✅ Using product:', testProduct.name);

    // Step 3: Create order
    const orderData = {
      userId: user.id,
      items: [{
        productId: testProduct.id,
        quantity: 1,
        unitPrice: testProduct.price || 100,
      }],
      shippingAddress: {
        street: '123 Test Street',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751001',
        country: 'India',
        firstName: user.firstName || 'Test',
        lastName: user.lastName || 'Customer',
        phone: user.phone || '+91 9876543210',
      },
      paymentMethod: 'COD',
      totalAmount: testProduct.price || 100,
      subtotal: testProduct.price || 100,
      shipping: 0,
    };

    console.log('📦 Order data:', JSON.stringify(orderData, null, 2));

    const orderResponse = await fetch(`${API_BASE_URL}/customer-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📡 Order response status:', orderResponse.status);

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('❌ Order creation failed:', errorText);
      throw new Error(`Order creation failed: ${errorText}`);
    }

    const order = await orderResponse.json();
    console.log('✅ Order created:', order.orderNumber);

    return NextResponse.json({
      status: 'success',
      message: 'Order created successfully through API forwarding',
      user: { id: user.id, email: user.email },
      product: { id: testProduct.id, name: testProduct.name, price: testProduct.price },
      order: { id: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount },
    });

  } catch (error) {
    console.error('❌ Order creation test failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
