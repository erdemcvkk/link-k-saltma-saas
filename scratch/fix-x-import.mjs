import fs from 'fs';
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove X from react import
content = content.replace('X, useState', 'useState');

// Add X to lucide-react import
if (content.includes('lucide-react"')) {
  content = content.replace('Trash2,', 'Trash2,\n  X,');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed X import successfully.');
