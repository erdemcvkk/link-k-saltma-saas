// create-admin.mjs
// Kullanım: node create-admin.mjs <email> <şifre> [isim]
// Örnek: node create-admin.mjs admin@site.com Sifre123 "Admin Kullanıcı"

import { createHash } from "crypto";
import { config } from "dotenv";
config(); // .env dosyasını yükle

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const name = args[2] || "Admin";

if (!email || !password) {
  console.error("❌ Kullanım: node create-admin.mjs <email> <şifre> [isim]");
  process.exit(1);
}

function hashPassword(pw) {
  return createHash("sha256").update(pw + process.env.ADMIN_TOKEN).digest("hex");
}

try {
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️  Bu email ile admin zaten mevcut. Şifre güncelleniyor...");
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash: hashPassword(password), name, isActive: true },
    });
    console.log("✅ Admin şifresi güncellendi:", email);
  } else {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        name,
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("✅ Yeni admin oluşturuldu:", email);
  }
} catch (err) {
  console.error("❌ Hata:", err.message);
} finally {
  await prisma.$disconnect();
}
