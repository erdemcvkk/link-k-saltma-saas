import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/media
 * Returns a list of all media items (admin only).
 */
export async function GET(req: Request) {
  try {
    const items = await db.media.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

/**
 * POST /api/media
 * Handles multipart/form-data upload of a single file.
 * Stores file in public/uploads and creates a Media record.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'application/octet-stream';
    const base64String = buffer.toString('base64');
    const url = `data:${mimeType};base64,${base64String}`;

    const media = await db.media.create({
      data: {
        filename: file.name ?? 'uploaded-file',
        url,
        mimeType,
        size: file.size,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
