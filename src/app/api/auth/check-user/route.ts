import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Website: Checking if user exists locally:', email);

    // Check in website database first
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (user) {
      console.log('✅ User found in website database:', user.id);
      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      });
    }

    console.log('❌ User not found in website database');
    return NextResponse.json({
      exists: false,
    });

  } catch (error) {
    console.error('❌ Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
