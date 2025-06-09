import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Forward the request to the admin panel PUBLIC API
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002/api'  // Local admin panel
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel

    console.log('Website Pages API: Forwarding to admin panel for slug:', slug);

    const response = await fetch(`${API_BASE_URL}/public/pages/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Website Pages API: Failed to fetch from admin API:', response.status);
      const error = await response.json().catch(() => ({ error: 'Page not found' }));
      return NextResponse.json(
        { error: error.error || 'Page not found' },
        { status: response.status }
      );
    }

    const page = await response.json();
    console.log('Website Pages API: Successfully fetched page:', page.title);

    return NextResponse.json(page);
  } catch (error) {
    console.error('Website Pages API: Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
