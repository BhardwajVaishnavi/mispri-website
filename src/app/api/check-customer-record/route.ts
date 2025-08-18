import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/check-customer-record - Check if customer record exists for user
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'vaishnavibhardwaj401@gmail.com';

    console.log('🔍 Checking customer record for:', email);

    // Forward to admin panel for checking
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const response = await fetch(`${API_BASE_URL}/check-customer-record?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    return NextResponse.json({
      websiteCheck: {
        email,
        timestamp: new Date().toISOString(),
      },
      adminPanelResult: result,
    });
  } catch (error) {
    console.error('❌ Error checking customer record:', error);
    return NextResponse.json(
      { error: 'Failed to check customer record', details: error.message },
      { status: 500 }
    );
  }
}
