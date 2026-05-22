import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackLinkClick } from "@/app/actions";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  try {
    // Increment click event in DB
    await trackLinkClick(linkId);

    // Query destination URL
    const link = await db.link.findUnique({
      where: { id: linkId },
      select: { url: true },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(link.url);
  } catch (err) {
    console.error("Outbound redirection error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
