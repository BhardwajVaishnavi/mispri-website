import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    console.log('🌐 Website: Forwarding OTP verification to admin panel API');

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to verify OTP' },
        { status: response.status }
      );
    }

    console.log('✅ Admin panel OTP verification response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Website OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
