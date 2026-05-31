const fs = require('fs');
const c = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((line, i) => {
  if (line.includes('Yeni Link Ekle') || line.includes('activeSubTab === "links"')) {
    console.log(i, line.trim().substring(0, 120));
  }
});
