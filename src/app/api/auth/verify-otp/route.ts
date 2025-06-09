import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log('🔍 Website OTP verification for:', email, 'with OTP:', otp);

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Check OTP from in-memory store
    const otpStore = global.otpStore || {};
    const storedOTP = otpStore[email];

    if (!storedOTP) {
      console.log('❌ No OTP found for email:', email);
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedOTP.expires) {
      console.log('❌ OTP expired for email:', email);
      delete otpStore[email]; // Clean up expired OTP
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (storedOTP.otp !== otp) {
      console.log('❌ Invalid OTP for email:', email);
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      email: email,
      name: 'Customer', // In real implementation, get from database
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
