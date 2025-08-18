import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    console.log('🌐 Website: Forwarding reset password to admin panel API');

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to reset password' },
        { status: response.status }
      );
    }

    console.log('✅ Admin panel reset password response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Website reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
