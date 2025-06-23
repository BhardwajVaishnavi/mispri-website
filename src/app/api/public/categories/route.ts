import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the admin panel's public categories API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const apiUrl = `${API_BASE_URL}/public/categories`;

    console.log('Public Categories API: Forwarding to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Public Categories API: Failed to fetch from admin API:', response.status);
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    const data = await response.json();
    console.log('Public Categories API: Successfully fetched', Array.isArray(data) ? data.length : 0, 'categories');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Public Categories API: Error:', error);
    // Return empty array instead of error to prevent homepage from breaking
    return NextResponse.json([]);
  }
}
