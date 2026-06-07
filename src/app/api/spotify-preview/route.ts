import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const spotifyUrl = searchParams.get("url");

    if (!spotifyUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const trimmed = spotifyUrl.trim();
    const match = trimmed.match(/open\.spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?track\/([a-zA-Z0-9]+)/i);
    
    if (!match) {
      return NextResponse.json({ error: "Invalid Spotify track URL" }, { status: 400 });
    }

    const trackId = match[1];
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

    const response = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Spotify embed page" }, { status: 500 });
    }

    const html = await response.text();
    
    // Attempt 1: Parse __NEXT_DATA__ JSON script tag (safest and most robust)
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        const data = JSON.parse(nextDataMatch[1]);
        const previewUrl = data?.props?.pageProps?.state?.data?.entity?.audioPreview?.url;
        if (previewUrl) {
          return NextResponse.json({ success: true, previewUrl });
        }
      } catch (e) {
        console.error("Error parsing __NEXT_DATA__ JSON from Spotify:", e);
      }
    }

    // Attempt 2: Simple regex search on the HTML string
    const previewMatch = html.match(/"audioPreview"\s*:\s*{\s*"url"\s*:\s*"([^"]+)"/);
    if (previewMatch && previewMatch[1]) {
      return NextResponse.json({ success: true, previewUrl: previewMatch[1] });
    }

    // Attempt 3: General mp3 search in the html
    const mp3Match = html.match(/https:\/\/[^"'\s]+\.mp3[^"'\s]*/);
    if (mp3Match && mp3Match[0]) {
      return NextResponse.json({ success: true, previewUrl: mp3Match[0] });
    }

    return NextResponse.json({ error: "Preview URL not found for this Spotify track" }, { status: 404 });
  } catch (error: any) {
    console.error("Spotify resolver API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
