// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

// Pincode type
export interface Pincode {
  code: string;
  city: string;
  state: string;
  isDeliverable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

// Product type
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
  costPrice: number;
  unit: string;
  imageUrl?: string;
  isActive: boolean;
  productImages?: ProductImage[];
}

// Product Image type
export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain: boolean;
  productId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sortOrder?: number;
}

// Cart Item type
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Address type
export interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order type
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: {
    name: string;
    quantity: number;
  }[];
}
