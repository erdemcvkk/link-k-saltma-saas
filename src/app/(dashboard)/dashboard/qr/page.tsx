import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import QrClient from "./qr-client";

export const revalidate = 0;

export default async function QrPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch QR codes
  const qrCodes = await db.qrCode.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedQrCodes = qrCodes.map((qr) => ({
    id: qr.id,
    name: qr.name,
    type: qr.type,
    value: qr.value,
    fgColor: qr.fgColor,
    bgColor: qr.bgColor,
    logoUrl: qr.logoUrl,
    createdAt: qr.createdAt.toISOString(),
  }));

  return <QrClient initialQrCodes={serializedQrCodes} />;
}
