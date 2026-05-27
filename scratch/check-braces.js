const fs = require('fs');
const content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
const lines = content.split('\n');

let depth = 0;
lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  if (line.includes('activeSubTab ===') || line.includes('activeTab ===')) {
    console.log(`Line ${lineNum}: ${line.trim()}`);
  }
  // Check curly brace nesting
  for (let char of line) {
    if (char === '{') depth++;
    if (char === '}') depth--;
  }
});
console.log('Final depth of curly braces:', depth);
