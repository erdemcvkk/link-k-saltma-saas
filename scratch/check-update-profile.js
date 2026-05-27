const fs = require('fs');
const content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('updateProfile(')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
