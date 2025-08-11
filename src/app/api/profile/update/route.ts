import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, phone } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating user profile:', { userId, name, email, phone });

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          email,
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
      console.error('❌ Error forwarding to admin panel:', error);
      
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
