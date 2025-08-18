import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Debug: Checking user existence for userId:', userId);

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const response = await fetch(`${API_BASE_URL}/debug-user?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User debug data:', data);
      return NextResponse.json(data);
    } else {
      const errorData = await response.text();
      console.error('❌ User debug failed:', {
        status: response.status,
        error: errorData
      });
      
      return NextResponse.json(
        { error: 'Failed to check user' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
