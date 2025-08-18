import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Debugging auth flow for:', email);
    
    const results = {
      step1_checkUser: null,
      step2_createUser: null,
      step3_verifyUser: null,
      errors: [],
    };

    // Step 1: Check if user exists
    try {
      console.log('🔍 Step 1: Checking if user exists...');
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      results.step1_checkUser = {
        exists: !!existingUser,
        user: existingUser,
      };
      
      console.log('✅ Step 1 complete:', results.step1_checkUser);
    } catch (error) {
      console.error('❌ Step 1 failed:', error);
      results.errors.push(`Step 1 error: ${error.message}`);
    }

    // Step 2: Try to create user if doesn't exist
    if (!results.step1_checkUser?.exists) {
      try {
        console.log('🆕 Step 2: Creating new user...');
        const newUser = await prisma.user.create({
          data: {
            email,
            name: name || 'Test User',
            phone: '',
            password: 'temp-password-hash',
            role: 'CUSTOMER',
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        });

        results.step2_createUser = {
          success: true,
          user: newUser,
        };
        
        console.log('✅ Step 2 complete:', results.step2_createUser);
      } catch (error) {
        console.error('❌ Step 2 failed:', error);
        results.errors.push(`Step 2 error: ${error.message}`);
        results.step2_createUser = {
          success: false,
          error: error.message,
        };
      }
    }

    // Step 3: Verify user exists after creation
    try {
      console.log('🔍 Step 3: Verifying user exists...');
      const verifyUser = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      results.step3_verifyUser = {
        exists: !!verifyUser,
        user: verifyUser,
      };
      
      console.log('✅ Step 3 complete:', results.step3_verifyUser);
    } catch (error) {
      console.error('❌ Step 3 failed:', error);
      results.errors.push(`Step 3 error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Auth flow debug complete',
      email: email,
      results: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Debug auth flow error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
