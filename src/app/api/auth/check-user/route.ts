import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Website: Checking if user exists:', email);

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User check response:', data);
        return NextResponse.json(data);
      } else {
        console.log('❌ User check failed, assuming user does not exist');
        return NextResponse.json({
          exists: false,
        });
      }
    } catch (error) {
      console.error('❌ Error forwarding to admin panel:', error);
      // Fallback: assume user doesn't exist
      return NextResponse.json({
        exists: false,
      });
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
