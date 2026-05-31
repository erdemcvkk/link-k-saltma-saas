const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Grid fixes
  // Replace grid-cols-X that is NOT preceded by : (meaning it's not md:grid-cols-X)
  // We use a regex with negative lookbehind if possible, or just replace and clean up.
  content = content.replace(/(?<![:\w])grid-cols-2\b/g, 'grid-cols-1 md:grid-cols-2');
  content = content.replace(/(?<![:\w])grid-cols-3\b/g, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3');
  content = content.replace(/(?<![:\w])grid-cols-4\b/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  content = content.replace(/(?<![:\w])grid-cols-5\b/g, 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5');

  // Also fix grid-cols-1 md:grid-cols-1 md:grid-cols-2 if it happened
  content = content.replace(/grid-cols-1\s+md:grid-cols-1\s+md:grid-cols-2/g, 'grid-cols-1 md:grid-cols-2');

  // 2. Padding/Margin fixes for mobile
  // Large paddings like p-8, p-10, p-12 -> p-4 md:p-X
  content = content.replace(/(?<![:\w])p-8\b/g, 'p-4 md:p-8');
  content = content.replace(/(?<![:\w])p-10\b/g, 'p-4 md:p-10');
  content = content.replace(/(?<![:\w])p-12\b/g, 'p-4 md:p-12');
  content = content.replace(/(?<![:\w])p-20\b/g, 'p-6 md:p-20');
  
  content = content.replace(/(?<![:\w])px-8\b/g, 'px-4 md:px-8');
  content = content.replace(/(?<![:\w])px-10\b/g, 'px-4 md:px-10');
  content = content.replace(/(?<![:\w])px-12\b/g, 'px-4 md:px-12');
  content = content.replace(/(?<![:\w])px-20\b/g, 'px-6 md:px-20');
  
  // 3. Typograhpy responsive fixes (text-3xl -> text-xl md:text-3xl)
  content = content.replace(/(?<![:\w])text-3xl\b/g, 'text-xl md:text-3xl');
  content = content.replace(/(?<![:\w])text-4xl\b/g, 'text-2xl md:text-4xl');
  content = content.replace(/(?<![:\w])text-5xl\b/g, 'text-3xl md:text-5xl');
  content = content.replace(/(?<![:\w])text-6xl\b/g, 'text-4xl md:text-6xl');

  // 4. Fixed width containers breaking mobile (e.g., w-96, w-[500px])
  content = content.replace(/(?<![:\w])w-96\b/g, 'w-full md:w-96');
  // We can't safely replace all w-[xxxpx] without a complex regex, but we can catch w-[500px] or similar big ones
  content = content.replace(/(?<![:\w])w-\[([4-9]\d{2}px)\]/g, 'w-full md:w-[$1]'); // matches 400px to 999px
  content = content.replace(/(?<![:\w])w-\[([1-9]\d{3,}px)\]/g, 'w-full md:w-[$1]'); // matches >= 1000px

  // Clean up potential duplicates
  content = content.replace(/grid-cols-1\s+md:grid-cols-1\s+md:grid-cols-/g, 'grid-cols-1 md:grid-cols-');
  content = content.replace(/text-xl\s+md:text-xl\s+md:text-/g, 'text-xl md:text-');
  content = content.replace(/p-4\s+md:p-4\s+md:p-/g, 'p-4 md:p-');

  // specifically check sablonlar and dashboard client which user mentioned
  if (file.includes('sablonlar-client.tsx') || file.includes('dashboard-client.tsx')) {
    // maybe there's a flex-row that needs flex-col md:flex-row
    content = content.replace(/(?<![:\w])flex-row\b/g, 'flex-col md:flex-row');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated classes in', file.replace(process.cwd() + '\\\\', ''));
  }
});
