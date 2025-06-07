import { NextResponse } from 'next/server';

// No default categories - only show real categories from admin panel
const defaultCategories: any[] = [];

export async function GET() {
  try {
    // Try to get categories from the admin panel PUBLIC API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/public/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const categories = await response.json();
      console.log('Categories received from admin panel:', categories);
      if (Array.isArray(categories) && categories.length > 0) {
        console.log('Returning categories from admin panel');
        return NextResponse.json(categories);
      }
    }

    console.log('Admin API failed or returned empty, using default categories');
    // Return default categories if admin API fails or returns empty
    return NextResponse.json(defaultCategories);
  } catch (error) {
    console.error('Error in categories API route:', error);
    // Return default categories on error
    return NextResponse.json(defaultCategories);
  }
}
