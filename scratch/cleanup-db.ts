import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const modernDarkTemplate = {
  name: "Cyber Neon",
  price: 0,
  category: "Tech & Cyber",
  coverUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=800&fit=crop",
  bgColor: "#09090b", // zinc-950
  fontStyle: "Inter",
  buttonStyle: JSON.stringify({
    bgColor: "#000000",
    textColor: "#06b6d4",
    borderColor: "#06b6d4",
    borderStyle: "solid",
    borderWidth: "2px",
    borderRadius: "12px",
    shadow: "0 0 15px rgba(6,182,212,0.3)"
  }),
  isCoded: true,
  customCss: `
    body { background-color: #09090b; color: #fff; font-family: "Inter", sans-serif; }
    .profile-card { background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(6,182,212,0.2); }
    .btn-link { transition: all 0.3s ease; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }
    .btn-link:hover { box-shadow: 0 0 25px rgba(6,182,212,0.6); transform: translateY(-2px); background: #06b6d4 !important; color: #000 !important; }
    .avatar-img { border: 3px solid #06b6d4; box-shadow: 0 0 20px rgba(6,182,212,0.4); }
  `
};

const minimalistLightTemplate = {
  name: "Clean Slate",
  price: 49,
  category: "Minimalist",
  coverUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=800&fit=crop",
  bgColor: "#ffffff",
  fontStyle: "Roboto",
  buttonStyle: JSON.stringify({
    bgColor: "#f4f4f5",
    textColor: "#18181b",
    borderColor: "#e4e4e7",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "24px",
    shadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
  }),
  isCoded: true,
  customCss: `
    body { background-color: #ffffff; color: #18181b; font-family: "Roboto", sans-serif; }
    .profile-card { border: none; box-shadow: none; }
    .btn-link { transition: all 0.2s ease; font-weight: 500; }
    .btn-link:hover { background-color: #18181b !important; color: #ffffff !important; }
    .avatar-img { border: 1px solid #e4e4e7; }
  `
};

async function main() {
  console.log("Cleaning up old templates and userTemplate relationships...");
  await prisma.userTemplate.deleteMany({});
  await prisma.template.deleteMany({});
  
  console.log("Seeding fresh Universal templates...");
  await prisma.template.create({ data: modernDarkTemplate });
  await prisma.template.create({ data: minimalistLightTemplate });
  
  console.log("Cleanup and Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
