const fs = require('fs');
const content = fs.readFileSync('src/app/[username]/profile-client.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('buttonStyle')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
