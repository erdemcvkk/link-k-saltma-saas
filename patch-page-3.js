const fs = require('fs');

const path = 'src/app/[username]/[addonSlug]/page.tsx';
const content = fs.readFileSync(path, 'utf-8');
const lines = content.split(/\r?\n/);

const fallbackIndex = lines.findIndex(l => l.includes('// Fallback for other addon types'));

if (fallbackIndex !== -1) {
  const newLayoutsContent = fs.readFileSync('newLayouts.txt', 'utf-8');
  const newLayouts = newLayoutsContent.split(/\r?\n/);
  lines.splice(fallbackIndex, 0, ...newLayouts);
  
  // JOIN WITH ACTUAL NEWLINE
  fs.writeFileSync(path, lines.join('\n'), 'utf-8');
  console.log("Patched page.tsx successfully!");
} else {
  console.log("Could not find fallbackIndex");
}
