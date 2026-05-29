const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function tailwindToHex(cls) {
  const arbitraryMatch = cls.match(/\[(#?[a-fA-F0-9]{3,8}|[a-zA-Z]+)\]/);
  if (arbitraryMatch) {
    let val = arbitraryMatch[1];
    if (!val.startsWith("#") && /^[a-fA-F0-9]{3,8}$/.test(val)) val = "#" + val;
    return val;
  }
  return null;
}

function parseButtonStyle(buttonStyleStr) {
  let animation = "";
  const unhandledClasses = [];
  const classes = buttonStyleStr.split(" ");
  for (const cls of classes) {
    const cleanCls = cls.trim();
    if (!cleanCls) continue;
    let handled = false;
    if (cleanCls.startsWith("bg-")) handled = true;
    if (cleanCls.startsWith("text-")) handled = true;
    if (cleanCls.startsWith("border-") && !/^border-\\d+$/.test(cleanCls) && cleanCls !== "border-none") handled = true;
    if (cleanCls.startsWith("border")) handled = true;
    if (cleanCls.startsWith("rounded-")) handled = true;
    if (cleanCls.startsWith("shadow-")) handled = true;
    if (cleanCls === "font-normal" || cleanCls === "font-bold" || cleanCls === "font-black" || cleanCls === "font-light") handled = true;

    if (!handled) unhandledClasses.push(cleanCls);
  }
  animation = unhandledClasses.join(" ");
  return { animation };
}

async function main() {
  const profiles = await prisma.profile.findMany();
  for (const profile of profiles) {
    if (!profile.theme || profile.theme === 'dark' || profile.theme === 'light' || profile.theme === 'custom') continue;
    
    const template = await prisma.template.findFirst({ where: { name: profile.theme } });
    if (!template || !template.buttonStyle) continue;

    const { animation } = parseButtonStyle(template.buttonStyle);

    if (animation) {
      console.log("Applying animation:", animation, "to user", profile.userId);
      await prisma.link.updateMany({
        where: { userId: profile.userId },
        data: { animation }
      });
    }
  }
  console.log("Successfully reapplied extra classes to all relevant links!");
}
main().finally(() => prisma.$disconnect());
