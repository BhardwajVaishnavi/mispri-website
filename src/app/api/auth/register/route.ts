import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and customer in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with CUSTOMER role
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      // Create customer profile
      const customer = await tx.customer.create({
        data: {
          userId: user.id,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          phone: phone || null,
          isSubscribed: false,
        },
      });

      // Create cart for the user
      await tx.cart.create({
        data: {
          userId: user.id,
        },
      });

      return { user, customer };
    });

    console.log('✅ Website Registration successful:', result.user.email);

    return NextResponse.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      customer: {
        id: result.customer.id,
        firstName: result.customer.firstName,
        lastName: result.customer.lastName,
        phone: result.customer.phone,
      },
    });
  } catch (error) {
    console.error('❌ Website Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
