import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ log: ['query'] });

try {
  const username = "developer_hub";
  console.log("Searching for:", username);
  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username.toLowerCase(),
      },
    },
    include: {
      profile: true,
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
  console.log("Result:", JSON.stringify(user, null, 2));
} catch (e) {
  console.error("Error:", e);
} finally {
  await db.$disconnect();
}
