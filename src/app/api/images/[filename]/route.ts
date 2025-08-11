import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    console.log('🖼️ Image request for:', filename);
    
    // Try to serve from admin panel first
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api';
    
    try {
      console.log('🔄 Forwarding image request to admin panel:', `${API_BASE_URL}/images/${filename}`);
      
      const response = await fetch(`${API_BASE_URL}/images/${filename}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        console.log('✅ Image served from admin panel:', filename);
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (adminError) {
      console.log('❌ Admin panel image fetch failed:', adminError);
    }
    
    // Try to serve from local public folder
    try {
      const imagePath = join(process.cwd(), 'public', 'images', filename);
      const imageBuffer = await readFile(imagePath);
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      let contentType = 'image/jpeg';
      
      switch (ext) {
        case 'png':
          contentType = 'image/png';
          break;
        case 'gif':
          contentType = 'image/gif';
          break;
        case 'webp':
          contentType = 'image/webp';
          break;
        case 'svg':
          contentType = 'image/svg+xml';
          break;
      }
      
      console.log('✅ Image served from local public folder:', filename);
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (localError) {
      console.log('❌ Local image fetch failed:', localError);
    }
    
    // Return placeholder image if not found
    console.log('⚠️ Image not found, returning placeholder:', filename);
    
    return NextResponse.redirect(new URL('/images/placeholder-product.svg', request.url));
    
  } catch (error) {
    console.error('❌ Error serving image:', error);
    
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
