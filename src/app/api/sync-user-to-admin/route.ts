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

    console.log('🔄 Syncing user to admin panel:', email);

    // Get user data from website database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Sync to admin panel
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    const response = await fetch(`${API_BASE_URL}/profile/update-by-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        phone: user.phone,
      }),
    });

    if (response.ok) {
      console.log('✅ User synced to admin panel successfully');
      return NextResponse.json({
        success: true,
        message: 'User synced to admin panel successfully',
      });
    } else {
      console.error('❌ Failed to sync user to admin panel');
      return NextResponse.json(
        { error: 'Failed to sync to admin panel' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
