import { NextRequest, NextResponse } from 'next/server';
import { checkPincode } from '@/lib/api';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Complete list of Bhubaneswar pincodes
const bhubaneswarPincodes = [
  // Central Bhubaneswar
  '751001', '751002', '751003', '751004', '751005',
  '751006', '751007', '751008', '751009', '751010',
  '751011', '751012', '751013', '751014', '751015',
  '751016', '751017', '751018', '751019', '751020',
  '751021', '751022', '751023', '751024', '751025',
  '751026', '751027', '751028', '751029', '751030',

  // Extended Bhubaneswar areas
  '751031', '751032', '751033', '751034', '751035',
  '751036', '751037', '751038', '751039', '751040',
  '751041', '751042', '751043', '751044', '751045',
  '751046', '751047', '751048', '751049', '751050',

  // Outer areas and suburbs
  '751051', '751052', '751053', '751054', '751055',
  '751056', '751057', '751058', '751059', '751060',
  '751061', '751062', '751063', '751064', '751065',
  '751066', '751067', '751068', '751069', '751070',

  // Industrial and IT areas
  '751071', '751072', '751073', '751074', '751075',
  '751076', '751077', '751078', '751079', '751080',
  '751081', '751082', '751083', '751084', '751085',
  '751086', '751087', '751088', '751089', '751090',

  // Airport and surrounding areas
  '751091', '751092', '751093', '751094', '751095',
  '751096', '751097', '751098', '751099', '751100'
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const action = searchParams.get('action');

    // If action is 'list', return all available pincodes
    if (action === 'list') {
      return NextResponse.json({
        pincodes: bhubaneswarPincodes,
        city: 'Bhubaneswar',
        state: 'Odisha',
        total: bhubaneswarPincodes.length,
        message: 'All supported pincodes for Bhubaneswar'
      });
    }

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
        return NextResponse.json({
          ...pincode,
          message: `Delivery available for ${code} in ${pincode.city}`,
          deliveryInfo: {
            freeDeliveryAbove: 500,
            deliveryCharge: 50,
            estimatedTime: '2-4 hours'
          }
        });
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
        message: `Delivery available for ${code} in Bhubaneswar`,
        deliveryInfo: {
          freeDeliveryAbove: 500,
          deliveryCharge: 50,
          estimatedTime: '2-4 hours'
        }
      });
    }

    // If not in the list, return not deliverable
    return NextResponse.json(
      {
        error: 'Pincode not found or not deliverable',
        isDeliverable: false,
        message: `Sorry, we don't deliver to ${code}. We currently serve only Bhubaneswar (751001-751100)`,
        supportedRange: '751001-751100',
        supportedCity: 'Bhubaneswar'
      },
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
