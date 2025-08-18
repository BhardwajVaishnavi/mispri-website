import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/debug-specific-customer - Debug specific customer issue
export async function GET(request: NextRequest) {
  try {
    const email = 'vaishnavibhardwaj401@gmail.com';
    const couponCode = 'TEST175486863147G';

    console.log('🔍 Debugging specific customer issue:', { email, couponCode });

    // Forward to admin panel for debugging
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const debugResponse = await fetch(`${API_BASE_URL}/debug-specific-customer?email=${encodeURIComponent(email)}&couponCode=${encodeURIComponent(couponCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const debugResult = await debugResponse.json();

    return NextResponse.json({
      websiteDebug: {
        targetEmail: email,
        targetCoupon: couponCode,
        timestamp: new Date().toISOString(),
      },
      adminPanelDebug: debugResult,
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  }
}
