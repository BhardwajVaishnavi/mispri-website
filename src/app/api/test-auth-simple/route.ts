import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple Auth Test');
    
    return NextResponse.json({
      success: true,
      message: 'Auth test endpoint working',
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      }
    });
    
  } catch (error) {
    console.error('❌ Auth test error:', error);
    return NextResponse.json(
      { error: 'Auth test failed', details: error.message },
      { status: 500 }
    );
  }
}
