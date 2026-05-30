const fs = require('fs');

const lines = fs.readFileSync('scratch/tab5-content.txt', 'utf8').split('\n');
const inner = lines.slice(2, lines.length - 2).join('\n');

let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
content = content.replace('<div id="owned-templates-injected"></div>', inner);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log('Injected successfully');
