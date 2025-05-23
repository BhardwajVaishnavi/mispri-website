import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/api';

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
    // Try to get categories from the database
    const categories = await getCategories();

    // If we got categories from the database, return them
    if (categories && categories.length > 0) {
      return NextResponse.json(categories);
    }

    // Otherwise, return the default categories
    return NextResponse.json(defaultCategories);
  } catch (error) {
    console.error('Error in categories API route:', error);
    // Return default categories on error
    return NextResponse.json(defaultCategories);
  }
}
