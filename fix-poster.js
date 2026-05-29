const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const css = `/* Ana kartı çerçevesiz ve poster gibi yapıyoruz */
.profile-card {
    position: relative;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    overflow: hidden;
    padding: 2rem !important; /* Fixed padding so contents don't hit edge */
    border-radius: 0; /* Poster keskinliği */
}

/* 1. Keskin Çapraz Beyaz Işık Hüzmesi (Diagonal Beam) */
body::before {
    content: "";
    position: absolute;
    top: -20%; left: -50%;
    width: 200%; height: 200%;
    /* Çapraz beyaz şeridi oluşturur */
    background: linear-gradient(55deg, transparent 40%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 52%, transparent 52%);
    z-index: 0;
    pointer-events: none;
}

/* 2. Sol üstteki karakteristik Beyaz Daire */
body::after {
    content: "";
    position: absolute;
    top: 40px; left: 40px;
    width: 50px; height: 50px;
    background-color: #ffffff;
    border-radius: 50%;
    z-index: 1;
}

/* 3. Linklerin olduğu alt bölümü koyu lacivert/gece mavisi (Silüet) yapıyoruz */
.links-container {
    position: relative;
    background-color: #0b2240; /* Görseldeki derin lacivert */
    padding: 40px 20px;
    margin-top: 2rem; /* Fixed massive margin */
    z-index: 2;
    border-top: 4px solid #0b2240;
    border-radius: 2rem; /* Optional: add radius to blend with links */
}
`;

async function main() {
  const template = await prisma.template.findFirst({
    where: { name: 'Artistic Vector Poster' }
  });

  if (template) {
    await prisma.template.update({
      where: { id: template.id },
      data: { customCss: css }
    });
    console.log("Updated Artistic Vector Poster CSS");
  } else {
    console.log("Template not found");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
