import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the main admin API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const { searchParams } = new URL(request.url);

    // Build the API URL with query parameters
    const apiUrl = new URL(`${API_BASE_URL}/products`);
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    console.log('Public Products API: Forwarding to:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Public Products API: Failed to fetch from admin API:', response.status);
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    const data = await response.json();
    console.log('Public Products API: Successfully fetched', Array.isArray(data) ? data.length : 0, 'products');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Public Products API: Error:', error);
    // Return empty array instead of error to prevent homepage from breaking
    return NextResponse.json([]);
  }
}
