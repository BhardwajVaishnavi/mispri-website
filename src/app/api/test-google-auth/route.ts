import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('🧪 Testing Google auth APIs for email:', email);
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    console.log('🌐 Using API base URL:', API_BASE_URL);
    
    // Test 1: Check if user exists
    console.log('🔍 Testing check-user API...');
    const checkResponse = await fetch(`${API_BASE_URL}/auth/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    console.log('📋 Check user response status:', checkResponse.status);
    const checkData = await checkResponse.text();
    console.log('📋 Check user response data:', checkData);
    
    // Test 2: Try to create Google user
    console.log('🆕 Testing google-register API...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/google-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        googleId: 'test-google-id',
      }),
    });
    
    console.log('📋 Register response status:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('📋 Register response data:', registerData);
    
    return NextResponse.json({
      success: true,
      checkUser: {
        status: checkResponse.status,
        data: checkData,
      },
      googleRegister: {
        status: registerResponse.status,
        data: registerData,
      },
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    );
  }
}
