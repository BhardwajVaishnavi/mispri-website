import { NextRequest, NextResponse } from 'next/server';

// Dynamic route - prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const { searchParams } = new URL(request.url);

    // Build the API URL with query parameters
    const apiUrl = new URL(`${API_BASE_URL}/products-with-variants`);
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    console.log('Website Products with Variants API: Forwarding to:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
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
        { error: `Failed to fetch products: ${response.status}` },
        { status: response.status }
      );
    }

    const productsData = await response.json();
    console.log('Website Products with Variants API: Products loaded successfully');

    // Add discount calculations to products and variants
    const processedData = {
      ...productsData,
      products: productsData.products ? productsData.products.map((product: any) => {
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
      }) : []
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Website Products with Variants API: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
