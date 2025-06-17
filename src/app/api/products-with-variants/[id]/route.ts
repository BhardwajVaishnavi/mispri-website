import { NextRequest, NextResponse } from 'next/server';

// Dynamic route - prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const apiUrl = `${API_BASE_URL}/products-with-variants/${productId}`;

    console.log('Website Products with Variants API: Forwarding to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Website Products with Variants API: Admin API failed:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch product: ${response.status}` },
        { status: response.status }
      );
    }

    const productData = await response.json();
    console.log('Website Products with Variants API: Product loaded successfully');

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Website Products with Variants API: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
