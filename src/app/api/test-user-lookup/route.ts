import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    console.log('🔍 Testing user lookup for vaishnavibhardwaj401@gmail.com');
    
    // Test the check-user API with your email
    const response = await fetch(`${API_BASE_URL}/auth/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'vaishnavibhardwaj401@gmail.com',
      }),
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: true,
      adminPanelUrl: API_BASE_URL,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error testing user lookup:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
