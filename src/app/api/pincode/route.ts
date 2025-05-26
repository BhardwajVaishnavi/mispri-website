import { NextRequest, NextResponse } from 'next/server';
import { checkPincode } from '@/lib/api';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Bhubaneswar pincodes as fallback
const bhubaneswarPincodes = [
  '751001', '751002', '751003', '751004', '751005',
  '751006', '751007', '751008', '751009', '751010',
  '751011', '751012', '751013', '751014', '751015',
  '751016', '751017', '751018', '751019', '751020',
  '751021', '751022', '751023', '751024', '751025',
  '751030'
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      );
    }

    try {
      // Try to check pincode using the API function
      const pincode = await checkPincode(code);

      if (pincode) {
        return NextResponse.json(pincode);
      }
    } catch (apiError) {
      console.error('Error checking pincode with API:', apiError);
      // Continue to fallback if API fails
    }

    // Fallback: Check if the pincode is in the Bhubaneswar list
    if (bhubaneswarPincodes.includes(code)) {
      return NextResponse.json({
        code,
        city: 'Bhubaneswar',
        state: 'Odisha',
        isDeliverable: true,
      });
    }

    // If not in the list, return not deliverable
    return NextResponse.json(
      { error: 'Pincode not found or not deliverable', isDeliverable: false },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in pincode API route:', error);
    return NextResponse.json(
      { error: 'Failed to check pincode' },
      { status: 500 }
    );
  }
}
