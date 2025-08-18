import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Getting user by email:', email);

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const response = await fetch(`${API_BASE_URL}/get-user-by-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User found by email:', data);
      return NextResponse.json(data);
    } else {
      const errorData = await response.text();
      console.error('❌ User lookup failed:', {
        status: response.status,
        error: errorData
      });
      
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Error getting user by email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
