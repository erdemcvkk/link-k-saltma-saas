import fs from 'fs';
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Hızlı Plan Simülatörü')) {
    console.log(i + ': ' + l.trim());
  }
});
