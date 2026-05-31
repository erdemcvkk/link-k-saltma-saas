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

  // Fix grid-cols duplication
  content = content.replace(/md:grid-cols-2\s+md:grid-cols-5/g, 'md:grid-cols-5');
  content = content.replace(/md:grid-cols-2\s+md:grid-cols-4/g, 'md:grid-cols-4');
  content = content.replace(/md:grid-cols-2\s+sm:grid-cols-3\s+md:grid-cols-5/g, 'sm:grid-cols-3 md:grid-cols-5');

  // Add flex-wrap to common justify-between rows if they have buttons
  // (We'll just add flex-wrap to `flex items-center justify-between` if it doesn't have it)
  content = content.replace(/className=["']flex items-center justify-between( [^"']*)?["']/g, (match) => {
    if (match.includes('flex-wrap') || match.includes('flex-col')) return match;
    return match.replace('flex items-center justify-between', 'flex flex-wrap items-center justify-between');
  });
  
  content = content.replace(/className={`flex items-center justify-between( [^`]*)?`/g, (match) => {
    if (match.includes('flex-wrap') || match.includes('flex-col')) return match;
    return match.replace('flex items-center justify-between', 'flex flex-wrap items-center justify-between');
  });

  // Make large gaps responsive
  content = content.replace(/(?<![:\w])gap-6\b/g, 'gap-4 md:gap-6');
  content = content.replace(/(?<![:\w])gap-8\b/g, 'gap-4 md:gap-8');
  content = content.replace(/(?<![:\w])gap-10\b/g, 'gap-5 md:gap-10');
  content = content.replace(/(?<![:\w])gap-12\b/g, 'gap-6 md:gap-12');
  
  // Clean up duplicate md:gap
  content = content.replace(/gap-4\s+md:gap-4\s+md:gap-6/g, 'gap-4 md:gap-6');
  content = content.replace(/gap-4\s+md:gap-4\s+md:gap-8/g, 'gap-4 md:gap-8');

  // Responsive paddings for large p-*
  content = content.replace(/(?<![:\w])p-5\b/g, 'p-4 md:p-5');
  content = content.replace(/(?<![:\w])p-12\b/g, 'p-4 md:p-12');
  content = content.replace(/(?<![:\w])p-16\b/g, 'p-6 md:p-16');

  // Avoid nesting like p-4 md:p-4 md:p-5
  content = content.replace(/p-4\s+md:p-4\s+md:p-5/g, 'p-4 md:p-5');

  // Text sizes for large headers
  content = content.replace(/(?<![:\w])text-4xl\b/g, 'text-2xl md:text-4xl');
  content = content.replace(/(?<![:\w])text-5xl\b/g, 'text-3xl md:text-5xl');
  content = content.replace(/(?<![:\w])text-6xl\b/g, 'text-4xl md:text-6xl');
  // cleanup
  content = content.replace(/text-2xl\s+md:text-2xl\s+md:text-4xl/g, 'text-2xl md:text-4xl');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Overhauled UX in', file.replace(process.cwd() + '\\', ''));
  }
});
