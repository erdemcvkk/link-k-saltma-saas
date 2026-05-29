const fs = require('fs');

function patchFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  
  const oldLogic = `if (type === "MINI_STORE" || type === "NEO_BRUTAL" || type === "ORGANIC" || type === "RETRO" || type === "ACADEMIA" || type === "Y2K") return "store";`;
  
  const newLogic = `if (type === "MINI_STORE") return "store";
    if (type === "NEO_BRUTAL") return "neo-brutal";
    if (type === "ORGANIC") return "organic";
    if (type === "RETRO") return "retro";
    if (type === "ACADEMIA") return "academia";
    if (type === "Y2K") return "y2k";`;
    
  if (code.includes(oldLogic)) {
    code = code.replace(oldLogic, newLogic);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log(`Patched ${filePath} successfully.`);
  } else {
    console.log(`Could not find oldLogic in ${filePath}`);
  }
}

patchFile('src/app/[username]/[addonSlug]/page.tsx');
patchFile('src/app/(dashboard)/dashboard/dashboard-client.tsx');
