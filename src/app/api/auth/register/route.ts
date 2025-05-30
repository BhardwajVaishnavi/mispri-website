import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Forward to admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/auth/customer-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        email,
        password,
        phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Registration failed' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
