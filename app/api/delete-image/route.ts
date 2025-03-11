import { NextRequest, NextResponse } from 'next/server';
import { moveImageToDeletedFolder } from '@/lib/storage-utils';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    const success = await moveImageToDeletedFolder(imageUrl);

    if (success) {
      return NextResponse.json({ success: true, message: 'Image moved to deleted folder' });
    } else {
      return NextResponse.json(
        { error: 'Failed to move image to deleted folder' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in delete-image API route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 