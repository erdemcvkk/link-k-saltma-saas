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
