import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
