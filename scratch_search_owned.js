const fs = require('fs');

const content = fs.readFileSync('src/app/(dashboard)/dashboard/editor/editor-client.tsx', 'utf8');
const lines = content.split('\n');

console.log("=== ownedTemplates in editor-client.tsx ===");
lines.forEach((line, idx) => {
  if (line.includes('ownedTemplates') || line.includes('TemplateItem')) {
    console.log(`${idx + 1}: ${line.strip ? line.strip() : line.trim()}`);
  }
});
