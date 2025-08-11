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
  // Complete list of Bhubaneswar pincodes
  const bhubaneswarPincodes = [
    // Central Bhubaneswar
    '751001', '751002', '751003', '751004', '751005',
    '751006', '751007', '751008', '751009', '751010',
    '751011', '751012', '751013', '751014', '751015',
    '751016', '751017', '751018', '751019', '751020',
    '751021', '751022', '751023', '751024', '751025',
    '751026', '751027', '751028', '751029', '751030',

    // Extended Bhubaneswar areas
    '751031', '751032', '751033', '751034', '751035',
    '751036', '751037', '751038', '751039', '751040',
    '751041', '751042', '751043', '751044', '751045',
    '751046', '751047', '751048', '751049', '751050',

    // Outer areas and suburbs
    '751051', '751052', '751053', '751054', '751055',
    '751056', '751057', '751058', '751059', '751060',
    '751061', '751062', '751063', '751064', '751065',
    '751066', '751067', '751068', '751069', '751070',

    // Industrial and IT areas
    '751071', '751072', '751073', '751074', '751075',
    '751076', '751077', '751078', '751079', '751080',
    '751081', '751082', '751083', '751084', '751085',
    '751086', '751087', '751088', '751089', '751090',

    // Airport and surrounding areas
    '751091', '751092', '751093', '751094', '751095',
    '751096', '751097', '751098', '751099', '751100'
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

/**
 * Send forgot password OTP
 */
export async function sendForgotPasswordOTP(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    return data;
  } catch (error) {
    console.error('Error sending forgot password OTP:', error);
    throw error;
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid OTP');
    }

    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string, otp: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}
