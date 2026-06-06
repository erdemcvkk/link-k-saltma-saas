import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("Global Settings Dump:");
    const settings = await db.globalSetting.findMany();
    for (const s of settings) {
        console.log(`- ${s.key}: "${s.value}"`);
    }
    await db.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
});
