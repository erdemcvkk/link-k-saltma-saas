import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAndSyncUser } from "@/lib/user-sync";

export async function PUT(req: Request) {
  try {
    const user = await checkAndSyncUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { addonType, config } = await req.json();

    if (!addonType || !config) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const updated = await db.userAddon.update({
      where: {
        userId_addonType: {
          userId: user.id,
          addonType,
        },
      },
      data: {
        config,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[USER_ADDON_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
