import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/media/[id]
 * Serves the media file as binary data from database base64 or local filesystem.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return new Response('Missing id', { status: 400 });
    }

    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return new Response('Not found', { status: 404 });
    }

    // Case 1: Database stored base64 URL
    if (media.url.startsWith('data:')) {
      const match = media.url.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const contentType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        return new Response(buffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Case 2: Filesystem path
    try {
      const filePath = `${process.cwd()}/public${media.url}`;
      const fs = await import('fs');
      const fileBuffer = await fs.promises.readFile(filePath);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': media.mimeType || 'application/octet-stream',
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (fsErr) {
      console.error('Filesystem read error:', fsErr);
      return new Response('File not found', { status: 404 });
    }
  } catch (error: any) {
    console.error('Get media error:', error);
    return new Response('Server error', { status: 500 });
  }
}

/**
 * DELETE /api/media/[id]
 * Deletes the media item from both the filesystem and the database.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Find media entry to get file path
    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Delete file from public/uploads
    try {
      const filePath = `${process.cwd()}/public${media.url}`; // url starts with /uploads/...
      const fs = await import('fs');
      await fs.promises.unlink(filePath);
    } catch (e) {
      // ignore if file missing or fails to delete
    }

    // Delete DB record
    await db.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
