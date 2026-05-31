const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

content = content.replace('{fonts.map(font => (', '{initialFonts.map(font => (');

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("Fixed fonts reference in dashboard-client.tsx");
