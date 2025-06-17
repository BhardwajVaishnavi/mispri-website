import { NextRequest, NextResponse } from 'next/server';

// Dynamic route - prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      );
    }

    // Check if we're in build time (no database access during build)
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time database connection
    const { prisma } = await import('@/lib/db');

    // Check if delivery is available for this pincode
    const deliveryLocation = await prisma.deliveryLocation.findFirst({
      where: {
        pincode: pincode,
        isActive: true,
      },
    });

    if (!deliveryLocation) {
      return NextResponse.json(
        { error: 'Delivery not available to this location' },
        { status: 404 }
      );
    }

    return NextResponse.json(deliveryLocation);
  } catch (error) {
    console.error('Error checking delivery location:', error);
    return NextResponse.json(
      { error: 'Failed to check delivery location' },
      { status: 500 }
    );
  }
}

// Seed some delivery locations for Bhubaneswar
export async function POST(request: NextRequest) {
  try {
    // Check if we're in build time (no database access during build)
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Dynamic import to avoid build-time database connection
    const { prisma } = await import('@/lib/db');

    const bhubaneswarPincodes = [
      { pincode: '751001', area: 'Bhubaneswar GPO', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751002', area: 'Sachivalaya Marg', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751003', area: 'Kharavel Nagar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751004', area: 'Bapuji Nagar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751005', area: 'Rajmahal Square', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751006', area: 'Jaydev Vihar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751007', area: 'Nayapalli', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751008', area: 'Saheed Nagar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751009', area: 'Old Town', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751010', area: 'Patia', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751011', area: 'Chandrasekharpur', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751012', area: 'Rasulgarh', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751013', area: 'Khandagiri', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751014', area: 'Udayagiri', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751015', area: 'Kalinga Nagar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751016', area: 'Mancheswar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751017', area: 'Bharatpur', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751018', area: 'Niladri Vihar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751019', area: 'Sundarpada', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751020', area: 'Baramunda', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751021', area: 'Infocity', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751022', area: 'Tamando', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751023', area: 'Palasuni', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751024', area: 'Laxmisagar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751025', area: 'Sailashree Vihar', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751026', area: 'Jagamara', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751027', area: 'Damana', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 0 },
      { pincode: '751028', area: 'Jatni', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 50 },
      { pincode: '751029', area: 'Khordha', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 50 },
      { pincode: '751030', area: 'Balianta', city: 'Bhubaneswar', state: 'Odisha', deliveryFee: 50 },
    ];

    // Create delivery locations
    const createdLocations = await Promise.all(
      bhubaneswarPincodes.map(async (location) => {
        try {
          return await prisma.deliveryLocation.upsert({
            where: { pincode: location.pincode },
            update: location,
            create: location,
          });
        } catch (error) {
          console.error(`Error creating location for pincode ${location.pincode}:`, error);
          return null;
        }
      })
    );

    const successCount = createdLocations.filter(Boolean).length;

    return NextResponse.json({
      message: `Successfully created/updated ${successCount} delivery locations`,
      locations: createdLocations.filter(Boolean),
    });
  } catch (error) {
    console.error('Error seeding delivery locations:', error);
    return NextResponse.json(
      { error: 'Failed to seed delivery locations' },
      { status: 500 }
    );
  }
}
