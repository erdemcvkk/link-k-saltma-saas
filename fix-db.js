const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const addons = await prisma.userAddon.findMany(); 
  let updatedCount = 0;
  for(let a of addons) { 
    if(['NEO_BRUTAL','ORGANIC','RETRO','ACADEMIA','Y2K'].includes(a.addonType)) { 
      let c = a.config ? JSON.parse(a.config) : {}; 
      if(!c.theme || c.theme === 'classic') { 
        if(a.addonType === 'NEO_BRUTAL') c.theme = 'neo-brutalism'; 
        if(a.addonType === 'ORGANIC') c.theme = 'organic-earth'; 
        if(a.addonType === 'RETRO') c.theme = 'retro-arcade'; 
        if(a.addonType === 'ACADEMIA') c.theme = 'dark-academia'; 
        if(a.addonType === 'Y2K') c.theme = 'y2k-holographic'; 
        await prisma.userAddon.update({where:{id:a.id}, data:{config: JSON.stringify(c)}}); 
        updatedCount++;
      } 
    } 
  } 
  console.log("Updated " + updatedCount + " addons");
} 
main();
