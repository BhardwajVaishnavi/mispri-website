import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Email, current password, and new password are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Changing user password for email:', email);

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Password changed successfully');
        return NextResponse.json(data);
      } else {
        const errorData = await response.text();
        console.error('❌ Password change failed:', {
          status: response.status,
          error: errorData
        });
        
        return NextResponse.json(
          { error: 'Failed to change password' },
          { status: response.status }
        );
      }
    } catch (error) {
      console.error('❌ Error forwarding to admin panel:', error);
      
      return NextResponse.json(
        { error: 'Failed to change password' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
