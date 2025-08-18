import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { email, name, phone } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating user profile:', { email, name, phone });

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/profile/update-by-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        phone,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile updated successfully:', data);
      return NextResponse.json(data);
    } else {
      const errorData = await response.text();
      console.error('❌ Profile update failed:', {
        status: response.status,
        error: errorData
      });

      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
