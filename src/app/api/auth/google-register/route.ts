import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, image, googleId } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    console.log('🆕 Website: Creating Google user locally:', { email, name, googleId });

    // Check if user already exists in website database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('✅ User already exists in website database:', existingUser.id);

      // Update existing user's name if needed
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name: name || existingUser.name,
          updatedAt: new Date(),
        },
      });

      // Also sync to admin panel in background
      syncToAdminPanel(email, name, image, googleId);

      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
        },
      });
    }

    // Create new user in website database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone: '', // Will be updated later in profile
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
        role: 'CUSTOMER',
      },
    });

    console.log('✅ User created successfully in website database:', newUser.id);

    // Also sync to admin panel in background (don't wait for it)
    syncToAdminPanel(email, name, image, googleId);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
      },
    });

  } catch (error) {
    console.error('❌ Error creating Google user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Background function to sync to admin panel
async function syncToAdminPanel(email: string, name: string, image?: string, googleId?: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';

    const response = await fetch(`${API_BASE_URL}/auth/google-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        image,
        googleId,
      }),
    });

    if (response.ok) {
      console.log('✅ User also synced to admin panel');
    } else {
      console.log('⚠️ Failed to sync to admin panel, but user created locally');
    }
  } catch (error) {
    console.log('⚠️ Could not reach admin panel, but user created locally');
  }
}
