import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/reviews - Get reviews from admin panel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward the request to the admin panel's public reviews API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    // Build the API URL with query parameters
    const apiUrl = new URL(`${API_BASE_URL}/public/reviews`);
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    console.log('🌐 Website Reviews API: Forwarding to:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('❌ Admin panel reviews API failed:', response.status);
      // Return empty array instead of error to prevent website breaking
      return NextResponse.json([]);
    }

    const reviews = await response.json();
    console.log(`✅ Received ${reviews.length} reviews from admin panel`);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('❌ Website reviews API error:', error);
    // Return empty array instead of error to prevent website breaking
    return NextResponse.json([]);
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📝 Website: Forwarding review submission to admin panel');
    
    // Forward the request to the admin panel's public reviews API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const response = await fetch(`${API_BASE_URL}/public/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || 'Failed to submit review' },
        { status: response.status }
      );
    }

    console.log('✅ Review submission forwarded successfully');
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Website review submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
