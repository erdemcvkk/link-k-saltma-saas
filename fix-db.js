const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany();
  let updated = 0;
  for (const t of templates) {
    let changed = false;
    let newButtonStyle = t.buttonStyle;
    if (newButtonStyle && (newButtonStyle.includes('font-extrabold') || newButtonStyle.includes('font-black'))) {
      newButtonStyle = newButtonStyle.replace(/font-extrabold/g, 'font-bold').replace(/font-black/g, 'font-bold');
      changed = true;
    }

    if (changed) {
      await prisma.template.update({
        where: { id: t.id },
        data: {
          buttonStyle: newButtonStyle
        }
      });
      updated++;
    }
  }
  
  const links = await prisma.link.findMany();
  let updatedLinks = 0;
  for (const l of links) {
    if (l.fontWeight === 'font-extrabold' || l.fontWeight === 'font-black') {
      await prisma.link.update({
        where: { id: l.id },
        data: {
          fontWeight: 'font-bold'
        }
      });
      updatedLinks++;
    }
  }

  console.log(`Updated ${updated} templates and ${updatedLinks} links in DB.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
