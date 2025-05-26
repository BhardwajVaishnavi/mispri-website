import { Category, Pincode, Product, User } from './types';

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // Try to fetch from admin panel API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/categories`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const categories = await response.json();
      if (Array.isArray(categories)) {
        return categories.map((cat: any) => ({
          id: cat.id || cat.category || cat.name,
          name: cat.name || cat.category,
          slug: (cat.slug || cat.name || cat.category).toLowerCase().replace(/ /g, '-'),
        })).slice(0, 10);
      }
    }

    // Fallback to default categories
    return [
      { id: 'flowers', name: 'Flowers', slug: 'flowers' },
      { id: 'cakes', name: 'Cakes', slug: 'cakes' },
      { id: 'birthday', name: 'Birthday', slug: 'birthday' },
      { id: 'anniversary', name: 'Anniversary', slug: 'anniversary' },
      { id: 'gifts', name: 'Gifts', slug: 'gifts' },
      { id: 'combos', name: 'Combos', slug: 'combos' },
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories on error
    return [
      { id: 'flowers', name: 'Flowers', slug: 'flowers' },
      { id: 'cakes', name: 'Cakes', slug: 'cakes' },
      { id: 'birthday', name: 'Birthday', slug: 'birthday' },
      { id: 'anniversary', name: 'Anniversary', slug: 'anniversary' },
      { id: 'gifts', name: 'Gifts', slug: 'gifts' },
      { id: 'combos', name: 'Combos', slug: 'combos' },
    ];
  }
}

/**
 * Check if a pincode is valid for delivery
 */
export async function checkPincode(code: string): Promise<Pincode | null> {
  // Bhubaneswar pincodes - in a real implementation, these would be fetched from the database
  const bhubaneswarPincodes = [
    '751001', '751002', '751003', '751004', '751005',
    '751006', '751007', '751008', '751009', '751010',
    '751011', '751012', '751013', '751014', '751015',
    '751016', '751017', '751018', '751019', '751020',
    '751021', '751022', '751023', '751024', '751025',
    '751030'
  ];

  if (bhubaneswarPincodes.includes(code)) {
    return {
      code,
      city: 'Bhubaneswar',
      state: 'Odisha',
      isDeliverable: true,
    };
  }

  return null;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products?categoryId=${encodeURIComponent(category)}`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const products = await response.json();
      return Array.isArray(products) ? products : [];
    }

    return [];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const product = await response.json();
      return product;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const products = await response.json();
      return Array.isArray(products) ? products.slice(0, 20) : [];
    }

    return [];
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    return [];
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<{ user: User } | null> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

/**
 * Register user
 */
export async function registerUser(name: string, email: string, password: string, phone?: string): Promise<{ user: User } | null> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}
