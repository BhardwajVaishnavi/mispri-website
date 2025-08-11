import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🌐 Website Login:', { email });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if we're in development mode and should use local processing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    if (isDevelopment && process.env.DATABASE_URL) {
      console.log('🔄 Development mode: Processing login locally');

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

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          include: { customer: true },
        });

        if (!user) {
          await prisma.$disconnect();
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Check if user is a customer
        if (user.role !== 'CUSTOMER') {
          await prisma.$disconnect();
          return NextResponse.json(
            { error: 'Access denied. Customer account required.' },
            { status: 403 }
          );
        }

        // Verify password
        let isValidPassword = false;

        // For demo customer, allow plain text password
        if (email === 'customer@example.com' && password === 'customer123') {
          isValidPassword = true;
        } else {
          // For other users, check hashed password
          isValidPassword = await bcrypt.compare(password, user.password);
        }

        if (!isValidPassword) {
          await prisma.$disconnect();
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        await prisma.$disconnect();

        const responseData = {
          id: user.id,
          name: user.name,
          firstName: user.customer?.firstName || user.name.split(' ')[0] || '',
          lastName: user.customer?.lastName || user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.customer?.phone || null,
          isSubscribed: user.customer?.isSubscribed || false,
          loyaltyPoints: user.customer?.loyaltyPoints || 0,
          createdAt: user.createdAt,
        };

        console.log('✅ Login completed locally');
        return NextResponse.json({ user: responseData });

      } catch (localError) {
        console.error('❌ Local login failed:', localError);
        // Fall back to API forwarding
      }
    }

    // Forward to admin panel API (production or fallback)
    console.log('🔄 Forwarding to admin panel API:', API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Invalid email or password' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
