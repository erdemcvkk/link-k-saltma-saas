const fs = require('fs');
const content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
const lines = content.split('\n');

let stack = [];
lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const trimmed = line.trim();
  
  // Find open braces with conditions
  if (trimmed.startsWith('{activeTab ===') || trimmed.startsWith('{activeSubTab ===')) {
    stack.push({ lineNum, type: trimmed, index: stack.length });
    console.log(' '.repeat(stack.length * 2) + `OPEN: ${trimmed} at line ${lineNum}`);
  }
  
  // Count braces in this line
  for (let char of line) {
    if (char === '{') {
      // Just record brace count if needed, but since we are looking at tab block structures, we can match corresponding closing '}' for our tab blocks.
    }
  }
});
