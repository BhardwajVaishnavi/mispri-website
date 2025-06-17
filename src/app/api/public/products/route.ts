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

    // Add discount calculations to products
    const productsWithDiscounts = Array.isArray(data) ? data.map((product: any) => {
      // Calculate discount percentage for main product
      let discountPercentage = 0;
      if (product.price && product.discountedPrice && product.discountedPrice < product.price) {
        discountPercentage = Math.round(((product.price - product.discountedPrice) / product.price) * 100);
      }

      // Calculate discount for variants if they exist
      const variantsWithDiscounts = product.variants ? product.variants.map((variant: any) => {
        let variantDiscountPercentage = 0;
        if (variant.price && variant.discountedPrice && variant.discountedPrice < variant.price) {
          variantDiscountPercentage = Math.round(((variant.price - variant.discountedPrice) / variant.price) * 100);
        }
        return {
          ...variant,
          discountPercentage: variantDiscountPercentage,
          hasDiscount: variantDiscountPercentage > 0
        };
      }) : [];

      return {
        ...product,
        discountPercentage,
        hasDiscount: discountPercentage > 0,
        variants: variantsWithDiscounts
      };
    }) : data;

    return NextResponse.json(productsWithDiscounts);
  } catch (error) {
    console.error('Public Products API: Error:', error);
    // Return empty array instead of error to prevent homepage from breaking
    return NextResponse.json([]);
  }
}
