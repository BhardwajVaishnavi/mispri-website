import { prisma } from './db';
import { Category, Pincode, Product, User } from './types';

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // Get distinct categories from products
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      where: {
        isActive: true,
      },
    });

    // Transform to Category type and limit to 10 categories
    return categories
      .map((item) => ({
        id: item.category,
        name: item.category,
        slug: item.category.toLowerCase().replace(/ /g, '-'),
      }))
      .slice(0, 10); // Limit to 10 categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
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
    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive',
        },
        isActive: true,
      },
      include: {
        productImages: {
          where: {
            isMain: true,
          },
          take: 1,
        },
      },
    });

    return products.map(product => ({
      ...product,
      description: product.description || undefined,
      imageUrl: product.imageUrl || undefined
    }));
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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productImages: true,
      },
    });

    return product ? {
      ...product,
      description: product.description || undefined,
      imageUrl: product.imageUrl || undefined
    } : null;
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
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
        isActive: true,
      },
      include: {
        productImages: {
          where: {
            isMain: true,
          },
          take: 1,
        },
      },
      take: 20,
    });

    return products.map(product => ({
      ...product,
      description: product.description || undefined,
      imageUrl: product.imageUrl || undefined
    }));
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
