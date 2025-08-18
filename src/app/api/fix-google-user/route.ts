import { NextRequest, NextResponse } from 'next/server';

// POST /api/fix-google-user - Manually fix Google user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, image } = body;

    console.log('🔧 Fixing Google user account:', { email, name });

    // Extract first and last name
    const nameParts = name?.split(' ') || [];
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    console.log('🔗 Calling admin panel:', `${API_BASE_URL}/auth/google-register`);
    
    const response = await fetch(`${API_BASE_URL}/auth/google-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        firstName,
        lastName,
        image,
        googleId: `google-${email}`, // Use email-based ID for consistency
      }),
    });

    console.log('📡 Admin panel response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User fixed successfully:', data);
      return NextResponse.json({
        success: true,
        message: 'User account fixed successfully',
        user: data.user,
      });
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to fix user:', {
        status: response.status,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fix user account',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Error fixing Google user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix user account',
        details: error.message
      },
      { status: 500 }
    );
  }
}
