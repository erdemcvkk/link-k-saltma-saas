const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx')) results.push(file);
  });
  return results;
}

const files = walk('src');
let totalFixed = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Remove the min-h-[48px] md:min-h-0 that was injected by the batch ux-patch.js earlier
  content = content.replace(/ min-h-\[48px\] md:min-h-0/g, '');
  
  // Fix double spaces left behind
  content = content.replace(/  +/g, ' ');
  
  if (content !== original) {
    fs.writeFileSync(f, content);
    totalFixed++;
    console.log('Cleaned min-h-48px from:', f.replace(process.cwd() + '\\', ''));
  }
});

console.log('Total files cleaned:', totalFixed);
