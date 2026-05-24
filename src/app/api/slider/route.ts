import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/slider
 * Returns an array of slider items from the database.
 */
export async function GET() {
  try {
    const items = await db.sliderItem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('Failed to fetch slider items', e);
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * POST /api/slider
 * Creates a new slider item.
 */
export async function POST(req: Request) {
  try {
    // Basic auth check can be added here if not using server actions
    // For now we assume server actions are primarily used, but if API is used:
    const body = await req.json();
    const { title, imageUrl, link } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const item = await db.sliderItem.create({
      data: { title, imageUrl, link: link || null },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error('Failed to create slider item', e);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

/**
 * DELETE /api/slider
 * Deletes a slider item.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await db.sliderItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Failed to delete slider item', e);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
