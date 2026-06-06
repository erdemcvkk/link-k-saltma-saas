const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'addons', 'addon-config-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We want to remove the block starting with `<div className="space-y-1.5 mb-4">` and containing `Eklenti Linki (Opsiyonel)`
// since the file uses 2 spaces or tab indentation, let's look for matching tags.
// An easy way is to replace the exact blocks using string replace.

// Let's print out lines to see if we can find the exact text
const lines = content.split(/\r?\n/);
let outputLines = [];
let skipMode = false;
let braceCount = 0;
let skipCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!skipMode && line.includes('Eklenti Linki (Opsiyonel)')) {
    // We want to skip this div. The div starts some lines before or on this line.
    // Let's look backward in outputLines to find the starting `<div className="space-y-1.5 mb-4">`
    let foundStart = false;
    for (let j = outputLines.length - 1; j >= 0; j--) {
      if (outputLines[j].includes('<div className="space-y-1.5 mb-4">')) {
        // We remove everything from j onwards
        outputLines = outputLines.slice(0, j);
        foundStart = true;
        break;
      }
    }
    if (foundStart) {
      skipMode = true;
      braceCount = 1; // we need to count matching closing </div>
      // Note: the line we just matched is line i, which has `<label ... Eklenti Linki ... </label>`
      // We will skip lines until we close the div.
      continue;
    }
  }

  if (skipMode) {
    // Count open/close tags or look for the closing </div>
    // Let's count `<div` and `</div` in the current line
    const openDivs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    braceCount += openDivs - closeDivs;
    if (braceCount <= 0) {
      skipMode = false;
      skipCount++;
      console.log(`Skipped block #${skipCount}`);
    }
    continue;
  }

  outputLines.push(line);
}

fs.writeFileSync(filePath, outputLines.join('\n'), 'utf8');
console.log('Successfully removed Eklenti Linki blocks!');
