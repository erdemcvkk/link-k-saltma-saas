import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
for (const u of users) {
  console.log(`plan=${u.plan} | username=${u.username} | email=${u.email} | id=${u.id}`);
}
await db.$disconnect();
