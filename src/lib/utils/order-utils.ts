import { prisma } from '@/lib/db';

/**
 * Generate a unique order number in the format MF100001, MF100002, etc.
 * This function ensures sequential numbering starting from MF100001
 */
export async function generateOrderNumber(): Promise<string> {
  try {
    // Get the latest order number from the database
    const latestOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: 'MF'
        }
      },
      orderBy: {
        orderNumber: 'desc'
      },
      select: {
        orderNumber: true
      }
    });

    let nextNumber = 100001; // Starting number

    if (latestOrder && latestOrder.orderNumber) {
      // Extract the number part from the latest order number (e.g., "MF100001" -> 100001)
      const numberPart = latestOrder.orderNumber.replace('MF', '');
      const currentNumber = parseInt(numberPart, 10);
      
      if (!isNaN(currentNumber)) {
        nextNumber = currentNumber + 1;
      }
    }

    return `MF${nextNumber}`;
  } catch (error) {
    console.error('Error generating order number:', error);
    // Fallback to timestamp-based number if database query fails
    const timestamp = Date.now().toString().slice(-6);
    return `MF${timestamp}`;
  }
}
