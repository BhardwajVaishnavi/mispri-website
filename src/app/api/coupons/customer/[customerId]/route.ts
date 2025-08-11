import { NextRequest, NextResponse } from 'next/server';

// GET /api/coupons/customer/[customerId] - Get available coupons for customer
export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Forward request to admin panel API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3003/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel
    
    const response = await fetch(`${API_BASE_URL}/coupons/customer/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch customer coupons' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching customer coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer coupons' },
      { status: 500 }
    );
  }
}
