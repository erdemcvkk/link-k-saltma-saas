const fs = require('fs');
const content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
const lines = content.split('\n');

let openBlocks = [];
let braceLevel = 0;

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  
  // Look for our specific conditions
  const trimmed = line.trim();
  if (trimmed.startsWith('{activeTab ===') || trimmed.startsWith('{activeSubTab ===')) {
    openBlocks.push({ lineNum, label: trimmed, braceLevel: braceLevel });
    console.log(`[START] ${trimmed} at line ${lineNum} (Brace Level: ${braceLevel})`);
  }

  // Count braces
  for (let char of line) {
    if (char === '{') {
      braceLevel++;
    } else if (char === '}') {
      braceLevel--;
      // Check if any block has closed
      for (let i = openBlocks.length - 1; i >= 0; i--) {
        const block = openBlocks[i];
        if (braceLevel === block.braceLevel) {
          console.log(`[CLOSE] ${block.label} (started at line ${block.lineNum}) closes at line ${lineNum}`);
          openBlocks.splice(i, 1);
        }
      }
    }
  }
});
