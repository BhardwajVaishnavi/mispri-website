import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    console.log('🌐 Website Registration:', { name, email, phone });

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Processing registration locally');

      try {
        // Import Prisma client for local processing
        const { PrismaClient } = require('@prisma/client');
        const bcrypt = require('bcrypt');

        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL
            }
          }
        });

        // Split name into firstName and lastName
        const firstName = name.split(' ')[0] || '';
        const lastName = name.split(' ').slice(1).join(' ') || '';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          await prisma.$disconnect();
          return NextResponse.json(
            { error: 'An account with this email already exists' },
            { status: 409 }
          );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with CUSTOMER role
        const newUser = await prisma.user.create({
          data: {
            name: `${firstName} ${lastName}`.trim(),
            email,
            password: hashedPassword,
            role: 'CUSTOMER',
          },
        });

        // Create customer profile
        const newCustomer = await prisma.customer.create({
          data: {
            userId: newUser.id,
            firstName,
            lastName: lastName || '',
            phone: phone || null,
            isSubscribed: false,
            loyaltyPoints: 0,
          },
        });

        // Create cart for the user
        await prisma.cart.create({
          data: {
            userId: newUser.id,
          },
        });

        await prisma.$disconnect();

        const responseData = {
          user: {
            id: newUser.id,
            name: newUser.name,
            firstName: newCustomer.firstName,
            lastName: newCustomer.lastName,
            email: newUser.email,
            phone: newCustomer.phone,
            isSubscribed: newCustomer.isSubscribed,
            loyaltyPoints: newCustomer.loyaltyPoints,
            createdAt: newUser.createdAt,
          }
        };

        console.log('✅ Registration completed locally');
        return NextResponse.json(responseData, { status: 201 });

      } catch (localError) {
        console.error('❌ Local registration failed:', localError);
        // Fall back to API forwarding
      }
    }

    // Forward the request to the admin panel API (production or fallback)
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    // Split name into firstName and lastName for the admin API
    const firstName = name.split(' ')[0] || '';
    const lastName = name.split(' ').slice(1).join(' ') || '';

    const response = await fetch(`${API_BASE_URL}/auth/customer-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Registration failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Website Registration successful:', email);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Website Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
