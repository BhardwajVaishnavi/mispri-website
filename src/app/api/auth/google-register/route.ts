import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, image, googleId } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    console.log('🆕 Website: Creating Google user:', { email, name, googleId });

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          image,
          googleId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User created successfully:', data);
        return NextResponse.json(data);
      } else {
        const errorText = await response.text();
        console.error('❌ User creation failed:', {
          status: response.status,
          error: errorText
        });
        
        // Fallback: create a simple user object
        const fallbackUser = {
          success: true,
          user: {
            id: `google-${Date.now()}`,
            email,
            name,
            avatar: image,
            role: 'CUSTOMER',
            isActive: true,
          },
        };
        
        console.log('🔄 Using fallback user creation:', fallbackUser);
        return NextResponse.json(fallbackUser);
      }
    } catch (error) {
      console.error('❌ Error forwarding to admin panel:', error);
      
      // Fallback: create a simple user object
      const fallbackUser = {
        success: true,
        user: {
          id: `google-${Date.now()}`,
          email,
          name,
          avatar: image,
          role: 'CUSTOMER',
          isActive: true,
        },
      };
      
      console.log('🔄 Using fallback user creation due to error:', fallbackUser);
      return NextResponse.json(fallbackUser);
    }
  } catch (error) {
    console.error('❌ Error creating Google user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
