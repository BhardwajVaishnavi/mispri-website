import { NextResponse } from 'next/server';

// Default categories as fallback
const defaultCategories = [
  { id: 'express', name: 'Express Delivery', slug: 'express-delivery' },
  { id: 'flowers', name: 'Flowers', slug: 'flowers' },
  { id: 'cakes', name: 'Cakes', slug: 'cakes' },
  { id: 'birthday', name: 'Birthday', slug: 'birthday' },
  { id: 'anniversary', name: 'Anniversary', slug: 'anniversary' },
  { id: 'gifts', name: 'Gifts', slug: 'gifts' },
  { id: 'personalised', name: 'Personalised', slug: 'personalised' },
  { id: 'plants', name: 'Plants', slug: 'plants' },
  { id: 'combos', name: 'Combos', slug: 'combos' },
  { id: 'international', name: 'International', slug: 'international' },
  { id: 'occasions', name: 'Occasions', slug: 'occasions' },
  { id: 'cookies', name: 'Cookies', slug: 'cookies' },
  { id: 'chocolate', name: 'Chocolate', slug: 'chocolate' },
];

export async function GET() {
  try {
    // Try to get categories from the admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const categories = await response.json();
      if (Array.isArray(categories) && categories.length > 0) {
        return NextResponse.json(categories);
      }
    }

    // Return default categories if admin API fails or returns empty
    return NextResponse.json(defaultCategories);
  } catch (error) {
    console.error('Error in categories API route:', error);
    // Return default categories on error
    return NextResponse.json(defaultCategories);
  }
}
