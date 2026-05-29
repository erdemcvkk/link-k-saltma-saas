const fs = require('fs');
const lines = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8').split('\n');
console.log(lines.slice(3640, 3660).join('\n'));
